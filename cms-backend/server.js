// Load environment variables first
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdf-parse');
const fs = require('fs');
const cors = require('cors');
const Fuse = require("fuse.js");
const { OpenAI } = require('openai');
const { HfInference } = require('@huggingface/inference');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const helmet = require('helmet');
const compression = require('compression');
const { body, validationResult } = require('express-validator');
const RAGSystem = require('./rag-system');

const app = express();

// Configuration from environment variables
const config = {
    port: parseInt(process.env.PORT) || 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'https://coaz.org'],
    ai: {
        provider: process.env.AI_PROVIDER || 'huggingface', // 'openai', 'huggingface', or 'offline'
        fallbackToOffline: process.env.AI_FALLBACK_OFFLINE !== 'false'
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
    },
    huggingface: {
        apiKey: process.env.HUGGINGFACE_API_KEY || '', // Optional - works without key
        model: process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium',
        qaModel: process.env.HUGGINGFACE_QA_MODEL || 'deepset/roberta-base-squad2',
        fallbackQaModel: process.env.HUGGINGFACE_FALLBACK_QA_MODEL || 'microsoft/DialoGPT-medium',
        maxTokens: parseInt(process.env.HUGGINGFACE_MAX_TOKENS) || 500
    },
    conversation: {
        maxHistory: parseInt(process.env.MAX_CONVERSATION_HISTORY) || 20,
        sessionTimeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES) || 60
    },
    rateLimit: {
        windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true'
    },
    pdf: {
        constitutionPath: process.env.CONSTITUTION_PDF_PATH || './constitution.pdf'
    }
};

// Enhanced logging setup
const logger = winston.createLogger({
    level: config.logging.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'coaz-chatbot' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Add console logging in development
if (config.nodeEnv !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// AI Provider initialization
let openai = null;
let hf = null;

// Initialize AI providers based on configuration
if (config.ai.provider === 'openai' && config.openai.apiKey) {
    try {
        openai = new OpenAI({
            apiKey: config.openai.apiKey
        });
        logger.info('OpenAI provider initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize OpenAI:', error.message);
    }
}

if (config.ai.provider === 'huggingface' || config.ai.fallbackToOffline) {
    try {
        hf = new HfInference(config.huggingface.apiKey);
        logger.info('Hugging Face provider initialized successfully (FREE!)');
    } catch (error) {
        logger.error('Failed to initialize Hugging Face:', error.message);
    }
}

// Log AI provider status
logger.info(`AI Provider: ${config.ai.provider}`);
if (!openai && !hf) {
    logger.warn('No AI providers available. Using constitution search only.');
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, enable in production
    crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// Rate limiting
const rateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMinutes * 60 * 1000, // Convert to milliseconds
    max: config.rateLimit.maxRequests,
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: `${config.rateLimit.windowMinutes} minutes`
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: `${config.rateLimit.windowMinutes} minutes`
        });
    }
});

// Apply rate limiting to API routes
app.use('/api/chat', rateLimiter);

// CORS configuration
const corsOptions = {
    origin: config.corsOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
if (config.logging.enableRequestLogging) {
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
        });
        next();
    });
}

let fuse;
let constitutionSections = [];
let constitutionFullText = '';
let ragSystem;

// Enhanced session management
class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.cleanup();
    }

    getSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastActivity = Date.now();
            return session;
        }
        
        const newSession = {
            id: sessionId,
            history: [],
            createdAt: Date.now(),
            lastActivity: Date.now()
        };
        
        this.sessions.set(sessionId, newSession);
        logger.info(`Created new session: ${sessionId}`);
        return newSession;
    }

    updateSessionHistory(sessionId, userMessage, botResponse) {
        const session = this.getSession(sessionId);
        session.history.push(
            { role: "user", content: userMessage },
            { role: "assistant", content: botResponse }
        );
        
        // Keep history manageable
        if (session.history.length > config.conversation.maxHistory) {
            session.history.splice(0, session.history.length - config.conversation.maxHistory);
        }
        
        session.lastActivity = Date.now();
    }

    cleanup() {
        setInterval(() => {
            const now = Date.now();
            const timeoutMs = config.conversation.sessionTimeoutMinutes * 60 * 1000;
            
            for (const [sessionId, session] of this.sessions.entries()) {
                if (now - session.lastActivity > timeoutMs) {
                    this.sessions.delete(sessionId);
                    logger.info(`Session expired and cleaned up: ${sessionId}`);
                }
            }
        }, 5 * 60 * 1000); // Check every 5 minutes
    }

    getStats() {
        return {
            activeSessions: this.sessions.size,
            sessions: Array.from(this.sessions.values()).map(s => ({
                id: s.id,
                messageCount: s.history.length,
                createdAt: s.createdAt,
                lastActivity: s.lastActivity
            }))
        };
    }
}

const sessionManager = new SessionManager();

// Load and parse constitution PDF
async function loadConstitution() {
    try {
        const dataBuffer = fs.readFileSync(`${__dirname}/constitution.pdf`);
        const data = await pdf(dataBuffer);
        console.log('PDF loaded successfully!');

        constitutionFullText = data.text;

        // Create sections by splitting on major headings
        constitutionSections = data.text
            .split(/(?=\b[A-Z][A-Za-z ]+\b)/g)
            .map(section => section.trim())
            .filter(section => section.length > 20);

        console.log(`Loaded ${constitutionSections.length} sections from the constitution.`);
    } catch (error) {
        console.error('Failed to load PDF:', error.message);
        process.exit(1);
    }
}

function initFuse() {
    if (constitutionSections.length === 0) {
        console.error('No constitution sections loaded');
        return;
    }

    fuse = new Fuse(constitutionSections, {
        includeScore: true,
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 3,
        keys: [
            { name: "text", weight: 1 },
            { name: "section", weight: 0.7 }
        ]
    });
    console.log("[OK] Constitution loaded and searchable");
}

function initRAGSystem() {
    if (constitutionSections.length === 0) {
        console.error('No constitution sections loaded for RAG system');
        return;
    }

    // Initialize RAG system with configuration
    ragSystem = new RAGSystem({
        qaModel: config.huggingface.qaModel || 'deepset/roberta-base-squad2',
        fallbackQaModel: config.huggingface.fallbackQaModel || 'microsoft/DialoGPT-medium',
        huggingfaceApiKey: config.huggingface.apiKey,
        maxRetrievedChunks: 3,
        retrievalThreshold: 0.3,
        maxContextLength: 2000,
        confidenceThreshold: 0.1
    });

    // Index the constitution documents
    ragSystem.indexDocuments(constitutionSections);
    console.log("[OK] RAG system initialized and documents indexed");
}

function searchConstitution(query, limit = 3) {
    if (!fuse) {
        console.error('Fuse not initialized');
        return ["[WARNING] Search not ready"];
    }

    const results = fuse.search(query, { limit });

    if (results.length === 0) {
        const broadResults = fuse.search(query.split(/\s+/)[0], { limit });
        if (broadResults.length > 0) {
            return broadResults.map(r => r.item);
        }

        const searchTerm = query.toLowerCase();
        const index = constitutionFullText.toLowerCase().indexOf(searchTerm);
        if (index !== -1) {
            const context = constitutionFullText.substring(Math.max(0, index - 100), index + searchTerm.length + 100);
            return [`Found in document: "${context}"`];
        }
    }

    return results.length > 0 ? results.map(r => r.item) : ["[ERROR] Sorry, I couldn't find anything in the constitution about that."];
}

function highlightKeywords(text, query) {
    const keywords = query.split(/\s+/).filter(word => word.length > 2); // skip very short words
    let result = text;
    for (const word of keywords) {
        const regex = new RegExp(`(${word})`, "gi");
        result = result.replace(regex, "<mark>$1</mark>");
    }
    return result;
}

function formatAnswer(query, answers) {
    if (answers.length === 1 && answers[0].startsWith("[ERROR]")) {
        return answers[0];
    }

    const processedAnswers = answers.map(answer =>
        highlightKeywords(answer, query)
    );

    return `[CONSTITUTION] Based on the constitution, here's what I found for your question ("${query}"):\n\n${processedAnswers.join("\n\n---\n\n")}`;
}

// AI Provider Functions
async function generateOpenAIResponse(messages) {
    if (!openai) {
        throw new Error('OpenAI not initialized');
    }
    
    const completion = await openai.chat.completions.create({
        model: config.openai.model,
        messages: messages,
        max_tokens: config.openai.maxTokens,
        temperature: config.openai.temperature,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
    });
    
    return completion.choices[0].message.content;
}

async function generateHuggingFaceResponse(query, constitutionContext) {
    if (!hf) {
        throw new Error('Hugging Face not initialized');
    }

    // If we have constitution context, ALWAYS try QA model first
    if (constitutionContext && constitutionContext.length > 100) {
        try {
            console.log('Using QA model with constitution context...');

            const result = await hf.questionAnswering({
                model: config.huggingface.qaModel,
                inputs: {
                    question: query,
                    context: constitutionContext.substring(0, 1500) // Reduced context length
                }
            });

            if (result && result.answer && result.answer.trim().length > 5) {
                console.log(`QA model success: ${result.answer.substring(0, 100)}...`);
                return `[CONSTITUTION] ${result.answer}`;
            }

        } catch (qaError) {
            console.log(`QA model failed: ${qaError.message}`);
            // Continue to fallback
        }
    }

    // Intelligent AI responses for general conversation (when HF models aren't available)
    const queryLower = query.toLowerCase().trim();
    
    // Pattern-based intelligent responses that feel more like AI
    if (queryLower.includes('hi') || queryLower.includes('hello') || queryLower.includes('hey')) {
        return ` Hello! I'm your COAZ AI assistant. I'm here to help you with information about the College of Anesthesiologists of Zambia. What would you like to know?`;
    }
    
    if (queryLower.includes('how are you') || queryLower.includes('how do you do')) {
        return ` I'm doing well, thank you for asking! I'm an AI assistant specialized in helping with COAZ-related questions. I have access to information about the constitution, membership, and organizational structure. How can I assist you today?`;
    }
    
    if (queryLower.includes('where') && queryLower.includes('zambia')) {
        return ` Zambia is a landlocked country in southern Africa. It's bordered by Tanzania, Malawi, Mozambique, Zimbabwe, Botswana, Namibia, Angola, and the Democratic Republic of Congo. The capital city is Lusaka. The College of Anesthesiologists of Zambia (COAZ) serves medical professionals throughout this country.`;
    }
    
    if (queryLower.includes('what') && (queryLower.includes('you') || queryLower.includes('assistant'))) {
        return ` I'm an AI assistant specifically designed to help with questions about the College of Anesthesiologists of Zambia (COAZ). I can provide information about membership requirements, organizational objectives, governance structure, and professional guidelines. I have access to the COAZ constitution and can answer questions about anesthesiology practices in Zambia.`;
    }
    
    if (queryLower.includes('thank') || queryLower.includes('thanks')) {
        return ` You're very welcome! I'm here to help with any questions about COAZ. Feel free to ask about membership, constitution, professional development, or anything else related to the College of Anesthesiologists of Zambia.`;
    }
    
    if (queryLower.includes('anesthesi') || queryLower.includes('anaesthesi')) {
        return ` Anesthesiology is a vital medical specialty focused on perioperative care, pain management, and critical care medicine. In Zambia, the College of Anesthesiologists of Zambia (COAZ) supports anesthesiologists through professional development, continuing education, and maintaining practice standards. Would you like to know more about COAZ's role in advancing anesthesiology in Zambia?`;
    }
    
    if (queryLower.includes('doctor') || queryLower.includes('medical') || queryLower.includes('physician')) {
        return ` COAZ serves medical doctors who specialize in anesthesiology in Zambia. The college provides professional support, continuing medical education, and maintains standards for anesthesiology practice. If you're a medical professional interested in anesthesiology or COAZ membership, I can provide information about requirements and benefits.`;
    }
    
    // Try simplified HF API call for other queries
    try {
        console.log('Attempting basic HF text generation...');
        
        const response = await hf.textGeneration({
            model: 'gpt2',
            inputs: query,
            parameters: {
                max_new_tokens: 50,
                temperature: 0.8,
                return_full_text: false
            }
        });

        if (response && response.generated_text && response.generated_text.trim().length > 10) {
            console.log('HF API success');
            return ` ${response.generated_text.trim()}`;
        }
    } catch (error) {
        console.log(`HF API unavailable: ${error.message}`);
    }
    
    // Smart fallback for general queries
    return ` I understand you're asking about "${query}". While I specialize in COAZ-related information, I'm here to help! Could you tell me more about what you'd like to know? I'm particularly knowledgeable about:

• COAZ membership and requirements
• Anesthesiology profession in Zambia  
• College constitution and governance
• Professional development opportunities
• Medical education and training

What specific aspect would you like to explore?`;
}

function generateOfflineResponse(query, constitutionContext) {
    // Intelligent rule-based responses when AI is not available
    const queryLower = query.toLowerCase();
    
    if (constitutionContext) {
        return `[CONSTITUTION] COAZ Constitution Information\n\n${constitutionContext}\n\n[TIP] This information was found in the COAZ constitution document. For more specific details, feel free to ask follow-up questions!`;
    }
    
    // Enhanced pattern matching for common queries
    if (queryLower.includes('membership') || queryLower.includes('member') || queryLower.includes('join')) {
        return "[MEMBERSHIP] COAZ Membership Information\n\nThe College of Anesthesiologists of Zambia welcomes qualified medical professionals interested in advancing anesthesiology practice.\n\n**Typical membership may include:**\n* Medical degree requirements\n* Anesthesiology specialization\n* Professional registration\n* Application procedures\n\n[TIP] Try asking: 'What are the membership requirements?' or 'How to apply for membership?'";
    }
    
    if (queryLower.includes('objective') || queryLower.includes('purpose') || queryLower.includes('goal') || queryLower.includes('mission')) {
        return "[MISSION] COAZ Mission & Objectives\n\nThe College of Anesthesiologists of Zambia is dedicated to:\n\n* Professional Excellence: Advancing anesthesiology practice standards\n* Education & Training: Supporting continuous medical education\n* Patient Safety: Promoting safe anesthesia practices\n* Professional Development: Fostering career growth for anesthesiologists\n* Healthcare Quality: Contributing to Zambia's healthcare improvement\n\n[TIP] Try asking: 'What are the main objectives of COAZ?'";
    }
    
    if (queryLower.includes('anesthesi') || queryLower.includes('anaesthesi')) {
        return "[INFO] About Anesthesiology\n\nAnesthesiology is a medical specialty focused on:\n\n* Perioperative Care: Before, during, and after surgery\n* Pain Management: Acute and chronic pain treatment\n* Critical Care: Intensive care medicine\n* Emergency Medicine: Life-saving interventions\n\nThe College of Anesthesiologists of Zambia supports professionals in this vital medical field.\n\n[TIP] Try asking: 'What does COAZ do for anesthesiologists?'";
    }
    
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('help') || queryLower.includes('start')) {
        return "[WELCOME] Welcome to COAZ Assistant!\n\nI'm here to help you learn about the College of Anesthesiologists of Zambia. I can assist with:\n\n* Constitution & Bylaws - Rules and governance\n* Membership Information - How to join and requirements\n* Organizational Objectives - COAZ's mission and goals\n* Professional Guidelines - Standards and practices\n* Educational Programs - Training and development\n\nWhat would you like to know about COAZ?";
    }
    
    if (queryLower.includes('confused') || queryLower.includes('confuse') || queryLower.includes('understand') || queryLower.includes('unclear')) {
        return "[HELP] I understand you're feeling confused!\n\nLet me help clarify things for you. I'm the COAZ Assistant, and I can explain:\n\n**About COAZ:**\n* What is COAZ? - College of Anesthesiologists of Zambia\n* Who we serve? - Anesthesiology professionals in Zambia\n* Our purpose? - Advancing anesthesia practice and education\n\n**I can help you with:**\n* Simple questions about COAZ\n* Membership information\n* Professional development\n* Constitution details\n\n**Try asking something simple like:**\n* 'What is COAZ?'\n* 'How do I join?'\n* 'What does COAZ do?'\n\nDon't worry - I'm here to help make things clear!";
    }
    
    if (queryLower.includes('committee') || queryLower.includes('board') || queryLower.includes('leadership')) {
        return "[LEADERSHIP] COAZ Leadership & Structure\n\nThe College of Anesthesiologists of Zambia operates through:\n\n* Board of Directors - Strategic governance\n* Executive Committee - Operational oversight\n* Professional Committees - Specialized focus areas\n* Regional Representatives - Local coordination\n\n[TIP] Try asking: 'Who are the board members?' or 'What committees exist?'";
    }
    
    if (queryLower.includes('training') || queryLower.includes('education') || queryLower.includes('cpd') || queryLower.includes('course')) {
        return "[EDUCATION] COAZ Education & Training\n\nThe College supports professional development through:\n\n* Continuing Professional Development (CPD) - Ongoing education\n* Workshops & Seminars - Skill enhancement programs\n* Conferences - Knowledge sharing events\n* Certification Programs - Professional credentials\n* Research Support - Academic advancement\n\n[TIP] Try asking: 'What training programs does COAZ offer?'";
    }
    
    // Advanced pattern matching for more questions
    if ((queryLower.includes('what') && (queryLower.includes('coaz') || queryLower.includes('college'))) || 
        (queryLower.includes('what is coaz') || queryLower.includes('about coaz'))) {
        return "[ABOUT] What is COAZ?\n\nThe College of Anesthesiologists of Zambia (COAZ) is a professional medical organization dedicated to:\n\n* Professional Excellence: Setting high standards for anesthesiology practice\n* Education & Training: Providing continuous medical education and professional development\n* Patient Safety: Promoting safe anesthesia practices across Zambia\n* Professional Unity: Bringing together anesthesiology professionals\n* Healthcare Advancement: Contributing to improved healthcare delivery\n\nCOAZ serves as the authoritative body for anesthesiology in Zambia, supporting both practitioners and patients through professional standards and advocacy.\n\n[TIP] Ask me: 'How do I join COAZ?' or 'What training does COAZ offer?'";
    }
    
    if (queryLower.includes('how') && (queryLower.includes('join') || queryLower.includes('apply') || queryLower.includes('become'))) {
        return "[MEMBERSHIP] How to Join COAZ\n\nMembership Process:\n\n1. Eligibility Requirements:\n* Medical degree from recognized institution\n* Completed anesthesiology training/specialization\n* Valid medical registration in Zambia\n* Professional references\n\n2. Application Steps:\n* Complete membership application form\n* Submit required documentation\n* Pay applicable membership fees\n* Attend orientation (if required)\n\n3. Membership Benefits:\n* Professional recognition and certification\n* Access to continuing education programs\n* Networking opportunities with peers\n* Professional development resources\n* Advocacy and professional support\n\n[TIP] For specific requirements and current application forms, contact COAZ directly or ask about specific membership categories.";
    }
    
    if (queryLower.includes('training') || queryLower.includes('education') || queryLower.includes('program') || queryLower.includes('course')) {
        return "[TRAINING] COAZ Training & Education Programs\n\nProfessional Development Offerings:\n\nContinuing Professional Development (CPD):\n* Regular workshops and seminars\n* Skills enhancement programs\n* Latest techniques and technologies\n* Mandatory CPD point accumulation\n\nEducational Events:\n* Annual conferences and symposiums\n* Research presentations and case studies\n* International speaker sessions\n* Peer learning opportunities\n\nSpecialized Training:\n* Advanced anesthesia techniques\n* Pain management protocols\n* Emergency and critical care\n* Pediatric anesthesia specialization\n\nCertification Programs:\n* Professional competency assessments\n* Specialized procedure certifications\n* Leadership development programs\n\n[TIP] Ask about: 'CPD requirements' or 'Upcoming COAZ events'";
    }
    
    if (queryLower.includes('contact') || queryLower.includes('reach') || queryLower.includes('phone') || queryLower.includes('email') || 
        queryLower.includes('how can i contact') || queryLower.includes('get in touch')) {
        return "[CONTACT] Contact COAZ\n\nGet in Touch with the College:\n\nOffice Information:\n* Professional administrative staff\n* Membership services department\n* Educational program coordinators\n* General inquiries and information\n\nContact Methods:\n* Official website with contact forms\n* Email for membership inquiries\n* Phone lines for urgent matters\n* Physical office for in-person visits\n\nBusiness Hours:\n* Regular office hours for administrative support\n* Emergency contacts for urgent professional matters\n* Scheduled appointment availability\n\nProfessional Services:\n* Membership application support\n* CPD program information\n* Professional development guidance\n* Constitutional and regulatory inquiries\n\n[TIP] For current contact details, please refer to the official COAZ constitution or recent organizational communications.";
    }
    
    // Enhanced default response with more intelligence
    const responseHints = [
        "What is COAZ?",
        "How do I join COAZ?", 
        "What training programs are available?",
        "What are COAZ's objectives?",
        "Who can become a member?",
        "What are the membership benefits?",
        "How do I contact COAZ?",
        "What is anesthesiology?"
    ];
    
    const randomHint = responseHints[Math.floor(Math.random() * responseHints.length)];
    
    return `[ASSISTANT] COAZ Assistant - Intelligent Response System\n\nI'm here to help you learn about the College of Anesthesiologists of Zambia! I have comprehensive knowledge about COAZ's structure, membership, and professional programs.\n\nI can provide detailed information about:\n* Organization Overview - What COAZ does and why it matters\n* Membership Process - How to join and membership benefits\n* Professional Development - Training programs and CPD requirements\n* Mission & Objectives - COAZ's goals and professional standards\n* Governance - Constitutional provisions and organizational structure\n* Anesthesiology Profession - Career guidance and professional insights\n\n[TIP] Try asking: "${randomHint}"\n\nI'm designed to provide helpful, accurate information about COAZ. What would you like to know?`;
}

// Enhanced simple response with intelligent patterns  
async function generateSimpleHuggingFaceResponse(query) {
    console.log('Generating enhanced AI response...');
    
    const queryLower = query.toLowerCase();
    
    // Context-aware responses
    if (queryLower.includes('help') || queryLower.includes('assist')) {
        return ` I'm here to help! As your COAZ AI assistant, I can provide information about the College of Anesthesiologists of Zambia, including membership details, constitutional provisions, and professional development opportunities. What specific information are you looking for?`;
    }
    
    if (queryLower.includes('confused') || queryLower.includes('understand')) {
        return ` I understand that can be confusing. Let me help clarify! I'm specialized in COAZ-related information. Could you ask me something specific about the College of Anesthesiologists of Zambia? For example, you could ask about membership requirements, organizational structure, or professional guidelines.`;
    }
    
    // Try one more HF attempt with minimal parameters
    try {
        const response = await hf.textGeneration({
            model: 'gpt2',
            inputs: `Question: ${query}\nAnswer:`,
            parameters: {
                max_new_tokens: 30,
                return_full_text: false
            }
        });

        if (response && response.generated_text) {
            const clean = response.generated_text.trim().replace(/^Answer:\s*/i, '');
            if (clean.length > 5) {
                return ` ${clean}`;
            }
        }
    } catch (error) {
        console.log(`Final HF attempt failed: ${error.message}`);
    }
    
    // Intelligent contextual response
    return ` Thank you for your question about "${query}". While I'm primarily designed to help with COAZ-related inquiries, I'm always happy to assist! 

I have comprehensive knowledge about:
- The College of Anesthesiologists of Zambia
- Membership processes and benefits  
- Professional development in anesthesiology
- Constitutional and governance matters
- Medical education standards

Is there something specific about COAZ or anesthesiology that I can help you with?`;
}

// Main intelligent AI response function  
async function generateIntelligentResponse(query, constitutionContext, sessionId = 'default') {
    const startTime = Date.now();
    
    try {
        logger.info(`Generating AI response using ${config.ai.provider} for session: ${sessionId}`, {
            service: 'coaz-chatbot',
            sessionId,
            provider: config.ai.provider,
            hasContext: !!constitutionContext
        });
        
        // Get session and conversation history
        const session = sessionManager.getSession(sessionId);
        let aiResponse;
        
        // Try different AI providers in order of preference
        if (config.ai.provider === 'openai' && openai) {
            // Build conversation context for OpenAI
            const messages = [
                {
                    role: "system",
                    content: `You are an AI assistant for the College of Anesthesiologists of Zambia (COAZ). You help users understand the COAZ constitution and provide information about the organization.

Key Guidelines:
1. If relevant constitution content is provided, use it as your primary source
2. Provide clear, helpful, and professional responses
3. Keep responses concise but informative
4. Always be helpful and encouraging

Constitution Context (if available): ${constitutionContext || 'No specific constitution content found for this query'}`
                },
                ...session.history.slice(-6), // Keep last 6 messages for context
                {
                    role: "user",
                    content: query
                }
            ];
            
            aiResponse = await generateOpenAIResponse(messages);
            
        } else if ((config.ai.provider === 'huggingface' || config.ai.fallbackToOffline) && hf) {
            aiResponse = await generateHuggingFaceResponse(query, constitutionContext);
            
        } else {
            throw new Error(`AI provider ${config.ai.provider} not available`);
        }
        
        const responseTime = Date.now() - startTime;
        
        // Update session history
        sessionManager.updateSessionHistory(sessionId, query, aiResponse);
        
        logger.info(`AI response generated successfully in ${responseTime}ms using ${config.ai.provider} for session: ${sessionId}`, {
            service: 'coaz-chatbot',
            sessionId,
            provider: config.ai.provider,
            responseLength: aiResponse?.length || 0,
            processingTime: responseTime
        });
        
        return aiResponse;
        
    } catch (error) {
        const responseTime = Date.now() - startTime;
        logger.error(`AI Error (${responseTime}ms):`, {
            service: 'coaz-chatbot',
            sessionId,
            provider: config.ai.provider,
            error: error.message,
            query: query.substring(0, 100),
            hasContext: !!constitutionContext,
            processingTime: responseTime
        });
        
        // Force retry with simple approach - NO offline fallback for non-constitution queries
        console.log('AI failed, attempting simple HF approach...');
        
        try {
            const simpleResponse = await generateSimpleHuggingFaceResponse(query);
            sessionManager.updateSessionHistory(sessionId, query, simpleResponse);
            return simpleResponse;
        } catch (retryError) {
            console.error('Simple retry also failed:', retryError.message);
            
            // Only now fallback to offline response as absolute last resort
            console.log('All AI attempts failed, using offline response');
            const offlineResponse = generateOfflineResponse(query, constitutionContext);
            sessionManager.updateSessionHistory(sessionId, query, offlineResponse);
            return offlineResponse;
        }
    }
}

// Determine if query needs constitution context
function needsConstitutionContext(query) {
    const constitutionKeywords = [
        'constitution', 'article', 'section', 'rule', 'regulation', 'membership',
        'objective', 'purpose', 'committee', 'board', 'election', 'duties',
        'responsibilities', 'amendment', 'bylaws', 'governance', 'structure',
        'coaz', 'college of anesthesiologists', 'anesthesiologist', 'medical',
        'professional', 'qualification', 'requirement', 'certification',
        'license', 'practice', 'ethics', 'disciplinary', 'meeting',
        'procedure', 'standard', 'guideline', 'policy', 'officer',
        'president', 'secretary', 'treasurer', 'executive', 'council'
    ];

    const queryLower = query.toLowerCase().trim();

    // Check for general greetings/phrases that DON'T need constitution
    const generalPhrases = [
        'hello', 'hi', 'hey', 'how are you', 'what are you', 'who are you',
        'are you real', 'are you ai', 'are you human', 'good morning',
        'good afternoon', 'good evening', 'thank you', 'thanks', 'bye',
        'goodbye', 'see you', 'help', 'what can you do', 'ok', 'okay',
        'yes', 'no', 'maybe', 'please', 'sorry', 'excuse me'
    ];

    // If it's clearly a general greeting/phrase, skip constitution
    if (generalPhrases.some(phrase => queryLower === phrase || queryLower.includes(phrase))) {
        return false;
    }

    // If it contains constitution keywords, use RAG
    return constitutionKeywords.some(keyword => queryLower.includes(keyword));
}

// Format RAG response for user display
function formatRAGResponse(ragResponse) {
    const { answer, confidence, model, contextChunks, metadata } = ragResponse;
    
    let formattedResponse = `[RAG-QA] ${answer}`;
    
    // Add confidence indicator
    if (confidence > 0.7) {
        formattedResponse += "\n\n✅ High confidence answer";
    } else if (confidence > 0.3) {
        formattedResponse += "\n\n⚠️ Medium confidence answer";
    } else {
        formattedResponse += "\n\n❓ Low confidence answer";
    }
    
    // Add model information
    if (metadata?.isExtraction) {
        formattedResponse += "\n\n📄 *Answer extracted from constitution text*";
    } else if (metadata?.isFallback) {
        formattedResponse += "\n\n🔄 *Generated using fallback AI model*";
    } else {
        formattedResponse += "\n\n🤖 *Generated using specialized QA model*";
    }
    
    // Add source information
    if (contextChunks > 0) {
        formattedResponse += `\n\n📚 *Based on ${contextChunks} relevant section${contextChunks > 1 ? 's' : ''} from the constitution*`;
    }
    
    return formattedResponse;
}

// Enhanced chat endpoint with RAG system
// Enhanced chat endpoint with RAG system
app.post("/api/chat", async (req, res) => {
    try {
        const { query, sessionId = 'default', useRag = true } = req.body;
        console.log("[QUERY] User asked:", query);

        if (!query || query.trim() === "") {
            return res.status(400).json({ error: "Query cannot be empty." });
        }

        let response;
        let responseType = "ai_general";
        let ragResponse = null;

        // Determine if we should use RAG
        const shouldUseRag = useRag && ragSystem && needsConstitutionContext(query);

        if (shouldUseRag) {
            console.log("[RAG] Using RAG system for constitution query...");

            try {
                ragResponse = await ragSystem.processQuery(query);

                // If RAG provides a confident answer, use it
                if (ragResponse.confidence > 0.1 && ragResponse.hasRelevantContext) {
                    response = formatRAGResponse(ragResponse);
                    responseType = "rag_qa";
                    console.log(`[RAG] Success - Confidence: ${ragResponse.confidence.toFixed(2)}`);
                } else {
                    // RAG found context but low confidence - use traditional AI with the context
                    console.log("[RAG] Low confidence, using AI with retrieved context");
                    const constitutionContext = ragResponse.metadata?.retrievedContext || null;
                    response = await generateIntelligentResponse(query, constitutionContext, sessionId);
                    responseType = "ai_with_constitution_fallback";
                }
            } catch (ragError) {
                console.error("[RAG] System error:", ragError.message);
                // Continue with traditional approach on RAG error
            }
        }

        // If RAG wasn't used or failed, use traditional approach
        if (!response) {
            let constitutionContext = null;

            // Only search constitution if it's constitution-related but RAG wasn't used
            if (needsConstitutionContext(query)) {
                console.log("[SEARCH] Searching constitution for context...");
                const searchResults = searchConstitution(query);

                if (searchResults.length > 0 && !searchResults[0].startsWith("[ERROR]")) {
                    constitutionContext = searchResults.slice(0, 2).join("\n\n"); // Limit to 2 results
                }
            }

            console.log("Generating AI response...");
            response = await generateIntelligentResponse(query, constitutionContext, sessionId);
            responseType = constitutionContext ? "ai_with_constitution" : "ai_general";
        }

        res.json({
            sender: "bot",
            text: response,
            responseType: responseType,
            ragMetadata: ragResponse ? {
                confidence: ragResponse.confidence,
                model: ragResponse.model,
                processingTime: ragResponse.processingTimeMs,
                contextChunks: ragResponse.contextChunks,
                hasRelevantContext: ragResponse.hasRelevantContext
            } : null
        });

    } catch (error) {
        console.error("Chat endpoint error:", error);

        // Enhanced fallback
        const offlineResponse = generateOfflineResponse(req.body.query || "", null);

        res.json({
            sender: "bot",
            text: offlineResponse,
            responseType: "fallback_error",
            error: true
        });
    }
});

// RAG System Status Endpoint
app.get("/api/rag-status", (req, res) => {
    try {
        const status = {
            isAvailable: !!ragSystem,
            stats: ragSystem ? ragSystem.getStats() : null,
            models: {
                primary: config.huggingface.qaModel,
                fallback: config.huggingface.fallbackQaModel
            },
            configuration: {
                maxRetrievedChunks: ragSystem?.config.maxRetrievedChunks || 'N/A',
                retrievalThreshold: ragSystem?.config.retrievalThreshold || 'N/A',
                maxContextLength: ragSystem?.config.maxContextLength || 'N/A'
            }
        };
        
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug endpoint to see query classification
app.post("/api/debug-query", async (req, res) => {
    const { question } = req.body;

    const debugInfo = {
        query: question,
        needsConstitution: needsConstitutionContext(question),
        ragAvailable: !!ragSystem,
        ragInitialized: ragSystem?.isInitialized
    };

    if (ragSystem && needsConstitutionContext(question)) {
        try {
            const chunks = await ragSystem.retrieveRelevantChunks(question);
            debugInfo.retrievedChunks = chunks.length;
            debugInfo.topChunkScore = chunks[0]?.score;
            debugInfo.topChunkPreview = chunks[0]?.text?.substring(0, 100) + '...';

            const ragResult = await ragSystem.processQuery(question);
            debugInfo.ragResult = {
                confidence: ragResult.confidence,
                hasRelevantContext: ragResult.hasRelevantContext,
                answerLength: ragResult.answer?.length,
                model: ragResult.model
            };
        } catch (error) {
            debugInfo.ragError = error.message;
        }
    }

    res.json(debugInfo);
});

// Test different query types
app.get("/api/test-queries", async (req, res) => {
    const testQueries = [
        "hello", // General - should be fast
        "what is coaz", // Constitution - should use RAG
        "membership requirements", // Constitution - should use RAG
        "are you a real person", // General - should be fast
        "board of directors structure" // Constitution - should use RAG
    ];

    const results = [];

    for (const query of testQueries) {
        const debugInfo = {
            query: query,
            needsConstitution: needsConstitutionContext(query),
            type: needsConstitutionContext(query) ? 'constitution' : 'general'
        };

        if (needsConstitutionContext(query) && ragSystem) {
            try {
                const start = Date.now();
                const ragResult = await ragSystem.processQuery(query);
                debugInfo.ragTime = Date.now() - start;
                debugInfo.ragConfidence = ragResult.confidence;
                debugInfo.ragSuccess = ragResult.confidence > 0.1;
            } catch (error) {
                debugInfo.ragError = error.message;
            }
        }

        results.push(debugInfo);
    }

    res.json(results);
});

// Test RAG endpoint
app.post("/api/test-rag", async (req, res) => {
    const { question } = req.body;

    if (!ragSystem) {
        return res.json({ error: "RAG system not initialized" });
    }

    try {
        const result = await ragSystem.processQuery(question);
        res.json(result);
    } catch (error) {
        res.json({ error: error.message });
    }
});

(async () => {
    await loadConstitution();
    initFuse();
    initRAGSystem();

    const PORT = config.port;
    
    app.listen(PORT, () => {
        logger.info(`🚀 COAZ Chatbot server running on port ${PORT}`);
        logger.info(`📊 Environment: ${config.nodeEnv}`);
        logger.info(`🤖 AI Provider: ${config.ai.provider}`);
        logger.info(`🌐 CORS Origins: ${config.corsOrigins.join(', ')}`);
        console.log(`\n=== COAZ Chatbot Server Started ===`);
        console.log(`🌐 Server: http://localhost:${PORT}`);
        console.log(`🤖 AI Provider: ${config.ai.provider}`);
        console.log(`📄 Constitution: Loaded (${constitutionSections.length} sections)`);
        console.log(`🧠 RAG System: ${ragSystem ? 'Initialized' : 'Not available'}`);
        console.log(`=====================================\n`);
    });
})();
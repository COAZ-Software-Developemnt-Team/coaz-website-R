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
const axios = require('axios');
const cheerio = require('cheerio');

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
    offlineResponse: {
        enabled: process.env.OFFLINE_RESPONSE_ENABLED !== 'false', // Default: enabled
        fallbackOnly: process.env.OFFLINE_RESPONSE_FALLBACK_ONLY === 'true', // Default: false (use for all patterns)
        forceSimpleAnswers: process.env.OFFLINE_FORCE_SIMPLE_ANSWERS === 'true' // Default: false
    },
    webScraping: {
        enabled: process.env.WEB_SCRAPING_ENABLED !== 'false', // Default: enabled
        coazWebsite: process.env.COAZ_WEBSITE_URL || 'https://coaz.org',
        cacheTimeout: parseInt(process.env.WEB_CACHE_TIMEOUT) || 3600000 // 1 hour default
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
let websiteCache = {
    data: null,
    lastUpdated: null,
    isLoading: false
};

// Clear cache on startup for testing
websiteCache.data = null;
websiteCache.lastUpdated = null;

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
    
    // Simple factual questions first
    if (queryLower.includes('coaz') && queryLower.includes('zambia') && (queryLower.includes('is') || queryLower.includes('in'))) {
        return `Yes, COAZ (College of Anesthesiologists of Zambia) is indeed in Zambia. It's the professional medical organization for anesthesiologists in the country.`;
    }

    if (queryLower.includes('where') && queryLower.includes('coaz')) {
        return `COAZ is located in Zambia. It's the College of Anesthesiologists of Zambia, serving anesthesiology professionals throughout the country.`;
    }

    if (queryLower.includes('country') && queryLower.includes('coaz')) {
        return `COAZ operates in Zambia. It stands for College of Anesthesiologists of Zambia.`;
    }

    // Simple yes/no questions
    if ((queryLower.includes('does') || queryLower.includes('is')) && queryLower.includes('coaz') && queryLower.includes('exist')) {
        return `Yes, COAZ exists. It's the College of Anesthesiologists of Zambia, the professional organization for anesthesiologists in the country.`;
    }

    if (queryLower.includes('what does coaz stand for') || queryLower.includes('coaz stands for')) {
        return `COAZ stands for "College of Anesthesiologists of Zambia".`;
    }

    if (queryLower.includes('full form') && queryLower.includes('coaz')) {
        return `The full form of COAZ is "College of Anesthesiologists of Zambia".`;
    }

    // Short answers for common questions
    if (queryLower.includes('when') && queryLower.includes('founded') && queryLower.includes('coaz')) {
        return `COAZ was established to serve anesthesiologists in Zambia. For the exact founding date, please refer to the constitution or contact COAZ directly.`;
    }

    if (queryLower.includes('head office') || queryLower.includes('headquarters')) {
        return `COAZ is headquartered in Zambia. For the exact address and contact details, please contact COAZ directly.`;
    }

    // Pattern-based intelligent responses that feel more like AI
    if (queryLower === 'hi' || queryLower === 'hello' || queryLower === 'hey' || queryLower.startsWith('hi ') || queryLower.startsWith('hello ') || queryLower.startsWith('hey ')) {
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
    
    // Skip HF text generation as it's unreliable - go straight to intelligent response
    console.log('Skipping HF text generation, using intelligent response...');
    
    // Try to extract basic information from constitution for simple queries
    if (constitutionContext && queryLower.length < 50) {
        // For short queries with constitution context, give a brief answer
        const contextSnippet = constitutionContext.substring(0, 200) + "...";
        return `Based on the COAZ constitution: ${contextSnippet}<br><br>Need more details? Feel free to ask a more specific question!`;
    }

    // Smart fallback for general queries
    return `I understand you're asking about "<strong>${query}</strong>". While I specialize in COAZ-related information, I'm here to help!<br><br>Could you tell me more about what you'd like to know? I'm particularly knowledgeable about:<br><br>• COAZ membership and requirements<br>• Anesthesiology profession in Zambia<br>• College constitution and governance<br>• Professional development opportunities<br>• Medical education and training<br><br>What specific aspect would you like to explore?`;
}

function generateOfflineResponse(query, constitutionContext) {
    // Intelligent rule-based responses when AI is not available
    const queryLower = query.toLowerCase();
    
    if (constitutionContext) {
        return `[CONSTITUTION] COAZ Constitution Information\n\n${constitutionContext}\n\n[TIP] This information was found in the COAZ constitution document. For more specific details, feel free to ask follow-up questions!`;
    }
    
    // Simple membership questions
    if (queryLower.includes('membership') && (queryLower.includes('cost') || queryLower.includes('fee') || queryLower.includes('price'))) {
        return `COAZ membership fees vary by category. Contact COAZ directly for current fee structure and payment options.`;
    }

    if (queryLower.includes('join') && queryLower.includes('coaz') && queryLower.length < 30) {
        return `To join COAZ, you need a medical degree, anesthesiology training, and valid Zambian medical registration. Apply through the COAZ membership committee.`;
    }

    // Enhanced pattern matching for common queries
    if (queryLower.includes('membership') || queryLower.includes('member') || queryLower.includes('join') || queryLower.includes('become')) {
        return `<strong>COAZ Membership Information</strong><br><br>The College of Anesthesiologists of Zambia (COAZ) offers membership to qualified medical professionals who are committed to excellence in anesthesiology.<br><br><strong>Membership Categories:</strong><br>• <strong>Full Members</strong>: Certified anesthesiologists with complete training<br>• <strong>Associate Members</strong>: Medical officers with anesthesia experience<br>• <strong>Student Members</strong>: Medical students interested in anesthesiology<br>• <strong>Honorary Members</strong>: Distinguished contributors to the field<br><br><strong>Typical Requirements:</strong><br>• Valid medical degree from recognized institution<br>• Completed anesthesiology training/specialization<br>• Current medical registration in Zambia<br>• Professional references and good standing<br>• Commitment to continuing professional development<br><br><strong>Membership Benefits:</strong><br>• Professional recognition and certification<br>• Access to continuing education programs<br>• Networking with anesthesiology professionals<br>• Career development opportunities<br>• Updates on best practices and guidelines<br><br><strong>Next Steps:</strong><br>• Contact COAZ directly for application forms<br>• Speak with current members for guidance<br>• Prepare required documentation<br><br><em>This information is based on typical professional medical college requirements. For exact details, please contact COAZ directly.</em>`;
    }
    
    if (queryLower.includes('objective') || queryLower.includes('purpose') || queryLower.includes('goal') || queryLower.includes('mission')) {
        return `<strong>COAZ Mission & Core Objectives</strong><br><br>The College of Anesthesiologists of Zambia (COAZ) is driven by a comprehensive mission to advance anesthesiology excellence across the nation.<br><br><strong>Our Primary Mission:</strong><br><strong>Advancing Anesthesiology Excellence</strong>: Elevating the standard of anesthesia care throughout Zambia through professional development, education, and advocacy.<br><br><strong>Core Objectives:</strong><br><br><strong>Professional Excellence</strong><br>• Establish and maintain high standards for anesthesiology practice<br>• Promote evidence-based medical practices<br>• Ensure competency through continuous assessment<br>• Foster ethical practice and professional integrity<br><br><strong>Education & Training</strong><br>• Provide comprehensive continuing medical education (CME)<br>• Organize specialized workshops and seminars<br>• Support residency and fellowship training programs<br>• Facilitate knowledge sharing and best practice dissemination<br><br><strong>Patient Safety & Quality Care</strong><br>• Develop and implement safety protocols<br>• Promote standardized anesthesia procedures<br>• Advocate for proper equipment and facility standards<br>• Monitor and improve patient outcomes<br><br><strong>Professional Development</strong><br>• Support career advancement for anesthesiologists<br>• Provide mentorship and networking opportunities<br>• Facilitate research and innovation in the field<br>• Recognize outstanding contributions to the profession<br><br><strong>Healthcare System Support</strong><br>• Collaborate with government health agencies<br>• Participate in healthcare policy development<br>• Support public health initiatives<br>• Contribute to Zambia's overall healthcare improvement<br><br><strong>Impact Areas:</strong><br>• Training the next generation of anesthesiologists<br>• Improving perioperative care across Zambia<br>• Advancing anesthesia research and innovation<br>• Strengthening healthcare infrastructure<br><br>These objectives ensure COAZ serves as the authoritative voice for anesthesiology in Zambia while promoting excellence in patient care.`;
    }
    
    if (queryLower.includes('anesthesi') || queryLower.includes('anaesthesi')) {
        return `**Understanding Anesthesiology** 🏥

Anesthesiology is a critical medical specialty that ensures patient safety and comfort during medical procedures. In Zambia, COAZ supports this vital field through professional excellence and education.

**What is Anesthesiology?**
Anesthesiology is the medical practice focused on the care of patients before, during, and after surgery, involving:

🔹 **Perioperative Care**
• Pre-operative assessment and preparation
• Intraoperative anesthetic management
• Post-operative pain control and recovery
• Monitoring vital functions throughout procedures

🔹 **Pain Management**
• Acute pain treatment (post-surgical, trauma)
• Chronic pain management programs
• Regional anesthesia techniques
• Palliative care support

🔹 **Critical Care Medicine**
• Intensive care unit (ICU) management
• Emergency resuscitation
• Life support systems management
• Multi-organ failure treatment

🔹 **Specialized Areas**
• Obstetric anesthesia (childbirth)
• Pediatric anesthesia (children)
• Cardiac anesthesia (heart surgery)
• Neuroanesthesia (brain/spine surgery)

**Role in Zambian Healthcare:**
The anesthesiologist is often called the "guardian angel" of the operating room, ensuring:
✅ Patient safety during vulnerable moments
✅ Pain-free surgical experiences
✅ Rapid response to medical emergencies
✅ Smooth surgical workflow

**COAZ's Support for Anesthesiologists:**
🎓 Continuing education programs
🛡️ Professional standards and guidelines
🤝 Peer support and networking
📊 Research and innovation initiatives
🏥 Advocacy for proper resources and equipment

**Career in Anesthesiology:**
• High demand specialty in Zambia
• Diverse practice opportunities
• Critical role in healthcare delivery
• Competitive compensation
• Opportunity for subspecialization

Anesthesiology combines advanced medical knowledge, technical skills, and the ability to make critical decisions under pressure, making it one of the most respected medical specialties.`;
    }
    
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('help') || queryLower.includes('start')) {
        return `<strong>Welcome to COAZ Assistant!</strong> 👋<br><br>I'm here to help you learn about the College of Anesthesiologists of Zambia. I can assist with:<br><br>• Constitution & Bylaws - Rules and governance<br>• Membership Information - How to join and requirements<br>• Organizational Objectives - COAZ's mission and goals<br>• Professional Guidelines - Standards and practices<br>• Educational Programs - Training and development<br><br>What would you like to know about COAZ?`;
    }
    
    if (queryLower.includes('confused') || queryLower.includes('confuse') || queryLower.includes('understand') || queryLower.includes('unclear')) {
        return "[HELP] I understand you're feeling confused!\n\nLet me help clarify things for you. I'm the COAZ Assistant, and I can explain:\n\n**About COAZ:**\n* What is COAZ? - College of Anesthesiologists of Zambia\n* Who we serve? - Anesthesiology professionals in Zambia\n* Our purpose? - Advancing anesthesia practice and education\n\n**I can help you with:**\n* Simple questions about COAZ\n* Membership information\n* Professional development\n* Constitution details\n\n**Try asking something simple like:**\n* 'What is COAZ?'\n* 'How do I join?'\n* 'What does COAZ do?'\n\nDon't worry - I'm here to help make things clear!";
    }
    
    if (queryLower.includes('committee') || queryLower.includes('board') || queryLower.includes('leadership')) {
        return `**COAZ Leadership & Governance Structure** 🏛️

The College of Anesthesiologists of Zambia operates through a well-structured governance system that ensures effective leadership and professional representation.

**Board of Directors** 👥
• **President**: Chief executive officer and public face of COAZ
• **Vice President**: Deputy leader and succession planning
• **Secretary General**: Administrative oversight and communications
• **Treasurer**: Financial management and budgetary control
• **Immediate Past President**: Advisory role and institutional memory

**Executive Committee** ⚖️
• **Strategic Planning**: Long-term vision and goal setting
• **Policy Development**: Professional standards and guidelines
• **Resource Management**: Allocation of organizational resources
• **External Relations**: Government and international partnerships
• **Crisis Management**: Emergency response and decision making

**Professional Committees** 🔬

**🎓 Education Committee**
• Curriculum development for training programs
• CPD requirements and accreditation
• Workshop and conference planning
• Quality assurance for educational content

**📊 Standards & Practice Committee**
• Clinical practice guidelines
• Safety protocol development
• Equipment and facility standards
• Quality improvement initiatives

**🔍 Research & Innovation Committee**
• Research grant administration
• Publication and dissemination support
• Innovation recognition programs
• Academic partnerships

**👨‍⚕️ Membership Committee**
• Application review and approval
• Member benefits and services
• Retention and engagement strategies
• Disciplinary procedures when necessary

**Regional Representatives** 🗺️
• **Lusaka Province**: Central region coordination
• **Copperbelt Province**: Mining region healthcare
• **Southern Province**: Agricultural region outreach
• **Northern Province**: Remote area representation
• **Eastern Province**: Border region coordination
• **Western Province**: Rural healthcare advocacy

**Leadership Roles & Responsibilities:**

**🎯 Strategic Leadership**
• Vision setting and organizational direction
• Stakeholder relationship management
• Professional advocacy and representation
• Crisis leadership and decision making

**📋 Operational Management**
• Day-to-day administrative oversight
• Committee coordination and support
• Resource allocation and management
• Performance monitoring and evaluation

**🤝 Professional Development**
• Mentorship program coordination
• Career advancement support
• Networking facilitation
• Recognition and awards programs

**Leadership Selection Process:**
• Democratic elections by membership
• Merit-based committee appointments
• Term limits to ensure fresh perspectives
• Succession planning for continuity

**Contact Leadership:**
📧 Reach executive committee through official channels
📞 Regional representatives available for local concerns
🏢 Board meetings open to member observation (quarterly)
📝 Annual leadership reports available to all members

COAZ's leadership structure ensures professional representation, effective governance, and responsive service to all members across Zambia.`;
    }
    
    if (queryLower.includes('training') || queryLower.includes('education') || queryLower.includes('cpd') || queryLower.includes('course')) {
        return `<strong>COAZ Education & Training Programs</strong><br><br>The College of Anesthesiologists of Zambia is committed to lifelong learning and professional excellence through comprehensive educational initiatives.<br><br><strong>Continuing Professional Development (CPD)</strong><br>• <strong>Mandatory CPD Points</strong>: Annual requirements to maintain membership<br>• <strong>Flexible Learning Options</strong>: Online courses, workshops, and self-study modules<br>• <strong>International Standards</strong>: Aligned with global anesthesiology education best practices<br>• <strong>Progress Tracking</strong>: Digital portfolio system for monitoring professional growth<br><br><strong>Workshop & Seminar Series</strong><br>• <strong>Monthly Skills Workshops</strong>: Hands-on training in latest techniques<br>• <strong>Clinical Case Reviews</strong>: Interactive learning from real-world scenarios<br>• <strong>Equipment Training</strong>: Updates on new anesthesia technology and equipment<br>• <strong>Safety Protocols</strong>: Regular updates on patient safety procedures<br><br><strong>Annual Conference & Symposium</strong><br>• <strong>National Anesthesia Conference</strong>: Premier annual gathering of professionals<br>• <strong>International Speakers</strong>: World-renowned experts sharing cutting-edge knowledge<br>• <strong>Research Presentations</strong>: Platform for local research and innovation<br>• <strong>Networking Opportunities</strong>: Professional connections and collaboration<br><br><strong>Specialized Training Programs</strong><br>• <strong>Pediatric Anesthesia</strong>: Advanced training for children's anesthesia care<br>• <strong>Cardiac Anesthesia</strong>: Specialized techniques for heart surgery procedures<br>• <strong>Pain Management</strong>: Comprehensive training in acute and chronic pain treatment<br>• <strong>Critical Care</strong>: Intensive care medicine and emergency response<br><br><strong>Training Benefits:</strong><br>• Enhanced clinical skills and knowledge<br>• Career advancement opportunities<br>• Professional recognition and credibility<br>• Improved patient outcomes<br>• Network expansion within the medical community<br><br><strong>Getting Started:</strong><br>• Register for upcoming workshops through COAZ portal<br>• Contact education committee for personalized learning plans<br>• Access online learning resources 24/7<br>• Connect with mentors in your area of interest<br><br>COAZ ensures every anesthesiologist in Zambia has access to world-class education and training opportunities.`;
    }
    
    // Advanced pattern matching for more questions
    if ((queryLower.includes('what') && (queryLower.includes('coaz') || queryLower.includes('college'))) || 
        (queryLower.includes('what is coaz') || queryLower.includes('about coaz')) ||
        (queryLower.includes('tell me about') && queryLower.includes('coaz')) ||
        (queryLower.includes('explain') && queryLower.includes('coaz'))) {
        return `<strong>About the College of Anesthesiologists of Zambia (COAZ)</strong><br><br>COAZ is the premier professional organization for anesthesiology specialists in Zambia, dedicated to advancing the field of anesthesia and patient care throughout the country.<br><br><strong>Our Mission:</strong><br>• <strong>Excellence in Patient Care</strong>: Ensuring the highest standards of anesthesiology practice<br>• <strong>Professional Development</strong>: Supporting continuous education and skill advancement<br>• <strong>Professional Unity</strong>: Bringing together anesthesia specialists across Zambia<br>• <strong>Standards & Guidelines</strong>: Establishing and maintaining practice standards<br>• <strong>Research & Innovation</strong>: Promoting advancement in anesthesiology techniques<br><br><strong>What We Do:</strong><br>• <strong>Education & Training</strong>: Organize workshops, seminars, and continuing professional development<br>• <strong>Certification</strong>: Maintain professional standards and certifications<br>• <strong>Advocacy</strong>: Represent anesthesiologists' interests with healthcare authorities<br>• <strong>Quality Assurance</strong>: Promote safe anesthesia practices nationwide<br>• <strong>Networking</strong>: Connect professionals for knowledge sharing and collaboration<br><br><strong>Our Impact:</strong><br>• Improving patient safety through standardized practices<br>• Advancing anesthesiology education in Zambia<br>• Supporting professional growth and career development<br>• Contributing to healthcare quality improvement<br><br>COAZ serves as the voice and professional home for anesthesiologists committed to excellence in patient care and advancing the specialty in Zambia.`;
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
    
    return `<strong>COAZ Assistant - Intelligent Response System</strong><br><br>I'm here to help you learn about the College of Anesthesiologists of Zambia! I have comprehensive knowledge about COAZ's structure, membership, and professional programs.<br><br>I can provide detailed information about:<br>• Organization Overview - What COAZ does and why it matters<br>• Membership Process - How to join and membership benefits<br>• Professional Development - Training programs and CPD requirements<br>• Mission & Objectives - COAZ's goals and purpose<br>• Professional Standards - Guidelines and best practices<br><br><strong>Try asking:</strong> "${randomHint}"`;
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
    return `Thank you for your question about "<strong>${query}</strong>". While I'm primarily designed to help with COAZ-related inquiries, I'm always happy to assist!<br><br>I have comprehensive knowledge about:<br>• The College of Anesthesiologists of Zambia<br>• Membership processes and benefits<br>• Professional development in anesthesiology<br>• Constitutional and governance matters<br>• Medical education standards<br><br>Is there something specific about COAZ or anesthesiology that I can help you with?`;
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

// Comprehensive website crawler and indexer
async function scrapeCoazWebsite() {
    if (!config.webScraping.enabled) {
        console.log('[WEB] Web scraping disabled');
        return null;
    }

    // Check cache first
    const now = Date.now();
    if (websiteCache.data && websiteCache.lastUpdated && 
        (now - websiteCache.lastUpdated) < config.webScraping.cacheTimeout) {
        console.log('[WEB] Using cached website data');
        return websiteCache.data;
    }

    if (websiteCache.isLoading) {
        console.log('[WEB] Already loading website data');
        return websiteCache.data;
    }

    try {
        websiteCache.isLoading = true;
        console.log(`[WEB] Starting comprehensive website crawl: ${config.webScraping.coazWebsite}`);
        
        // Discover all pages on the website
        const discoveredUrls = await discoverWebsitePages(config.webScraping.coazWebsite);
        console.log(`[WEB] 🔍 Discovery complete! Found ${discoveredUrls.length} pages to scrape:`);
        discoveredUrls.forEach((url, index) => {
            console.log(`[WEB] ${index + 1}. ${url}`);
        });
        
        // Scrape all discovered pages
        const allPageData = await scrapeMultiplePages(discoveredUrls);
        console.log(`[WEB] 📄 Successfully scraped ${allPageData.length} out of ${discoveredUrls.length} pages`);
        
        // Show detailed results for each page
        allPageData.forEach((page, index) => {
            console.log(`[WEB] 📋 Page ${index + 1}: ${page.url}`);
            console.log(`[WEB]   - Title: "${page.title}"`);
            console.log(`[WEB]   - Content sections: ${page.content.length}`);
            console.log(`[WEB]   - Headings: ${page.headings.length}`);
            console.log(`[WEB]   - Navigation links: ${page.navigation.length}`);
            console.log(`[WEB]   - Phones found: ${page.contact.phones.length}${page.contact.phones.length > 0 ? ` (${page.contact.phones.join(', ')})` : ''}`);
            console.log(`[WEB]   - Emails found: ${page.contact.emails.length}${page.contact.emails.length > 0 ? ` (${page.contact.emails.join(', ')})` : ''}`);
            console.log(`[WEB]   - Addresses found: ${page.contact.addresses.length}${page.contact.addresses.length > 0 ? ` (${page.contact.addresses[0].substring(0, 50)}...)` : ''}`);
            console.log(`[WEB]   ---`);
        });
        
        // Index and consolidate all content
        const websiteData = indexWebsiteContent(allPageData);
        
        console.log(`[WEB] Successfully crawled and indexed ${allPageData.length} pages`);
        
        // Cache the comprehensive data
        websiteCache.data = websiteData;
        websiteCache.lastUpdated = now;
        
        return websiteData;

    } catch (error) {
        console.error(`[WEB] Error during website crawl: ${error.message}`);
        return null;
    } finally {
        websiteCache.isLoading = false;
    }
}

// Discover all pages on the website with specific COAZ navigation targets
async function discoverWebsitePages(baseUrl) {
    const discovered = new Set();
    
    // Add the main page
    discovered.add(baseUrl);
    
    // Specific COAZ pages from the navigation structure you provided
    const specificPages = [
        '/home',
        '/association/delivering_care',
        '/association/professional_practice', 
        '/association/training_institutions_and_students',
        '/association/advocacy_in_health_care',
        '/association/member_benefits',
        '/about',
        '/news',
        '/services',
        '/categories',
        '/organisation',
        '/membership',
        '/contact',
        '/login',
        '/register'
    ];
    
    console.log(`[WEB] Adding specific COAZ navigation pages...`);
    
    // Convert relative URLs to absolute and add to discovery
    specificPages.forEach(page => {
        try {
            const fullUrl = new URL(page, baseUrl).href;
            discovered.add(fullUrl);
            console.log(`[WEB] Target page: ${fullUrl}`);
        } catch (error) {
            console.log(`[WEB] Skipping invalid URL: ${page}`);
        }
    });
    
    // Also do automatic discovery for any additional pages
    const maxPages = 25; // Increased limit
    const toVisit = [baseUrl];
    const visitedForDiscovery = new Set([baseUrl]);
    
    try {
        while (toVisit.length > 0 && discovered.size < maxPages) {
            const currentUrl = toVisit.shift();
            if (visitedForDiscovery.has(currentUrl)) continue;
            
            visitedForDiscovery.add(currentUrl);
            console.log(`[WEB] Auto-discovering links on: ${currentUrl}`);
            
            const response = await axios.get(currentUrl, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'COAZ-Chatbot/1.0 (Comprehensive Website Crawler)'
                }
            });

            const $ = cheerio.load(response.data);
            
            // Find all internal links including those in navigation menus
            $('a[href], [href]').each((index, element) => {
                let href = $(element).attr('href');
                if (!href) return;
                
                // Convert relative URLs to absolute
                if (href.startsWith('/')) {
                    href = new URL(href, baseUrl).href;
                } else if (href.startsWith('./')) {
                    href = new URL(href.substring(2), currentUrl).href;
                } else if (!href.startsWith('http')) {
                    href = new URL(href, currentUrl).href;
                }
                
                // Only include same-domain links, exclude anchors and external links
                if (href.startsWith(baseUrl) && !href.includes('#') && !href.includes('mailto:') && !href.includes('tel:')) {
                    discovered.add(href);
                    if (!visitedForDiscovery.has(href) && toVisit.length < 10) {
                        toVisit.push(href);
                    }
                }
            });
        }
        
        const finalPages = Array.from(discovered);
        console.log(`[WEB] Discovery complete! Found ${finalPages.length} total pages to scrape`);
        return finalPages;
        
    } catch (error) {
        console.error(`[WEB] Error during auto-discovery: ${error.message}`);
        // Return at least the specific pages we know about
        return Array.from(discovered);
    }
}

// Scrape multiple pages concurrently
async function scrapeMultiplePages(urls) {
    const maxConcurrent = 3; // Limit concurrent requests
    const allPageData = [];
    
    for (let i = 0; i < urls.length; i += maxConcurrent) {
        const batch = urls.slice(i, i + maxConcurrent);
        const batchPromises = batch.map(url => scrapeSinglePage(url));
        
        try {
            const batchResults = await Promise.allSettled(batchPromises);
            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allPageData.push(result.value);
                } else {
                    console.error(`[WEB] Failed to scrape: ${batch[index]}`);
                }
            });
        } catch (error) {
            console.error(`[WEB] Batch scraping error: ${error.message}`);
        }
        
        // Small delay between batches to be respectful
        if (i + maxConcurrent < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return allPageData;
}

// Scrape a single page comprehensively
async function scrapeSinglePage(url) {
    try {
        console.log(`[WEB] 📄 Scraping: ${url}`);
        
        const response = await axios.get(url, {
            timeout: 20000, // Increased timeout
            headers: {
                'User-Agent': 'COAZ-Chatbot/1.0 (Comprehensive COAZ Website Scraper)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive'
            }
        });

        if (response.status !== 200) {
            console.log(`[WEB] ❌ Failed to load ${url}: HTTP ${response.status}`);
            return null;
        }

        const $ = cheerio.load(response.data);
        console.log(`[WEB] ✅ Successfully loaded ${url} (${response.data.length} characters)`);
        
        // Extract comprehensive page data
        const pageData = {
            url: url,
            title: $('title').text() || '',
            description: $('meta[name="description"]').attr('content') || '',
            headings: [],
            content: [],
            contact: {
                addresses: [],
                phones: [],
                emails: [],
                socialMedia: []
            },
            navigation: [],
            lastScraped: Date.now()
        };

        // Extract all headings with hierarchy
        $('h1, h2, h3, h4, h5, h6').each((index, element) => {
            const $el = $(element);
            pageData.headings.push({
                level: element.tagName.toLowerCase(),
                text: $el.text().trim(),
                id: $el.attr('id') || null
            });
        });

        // Extract all meaningful content sections
        $('main, article, section, div.content, .container, .main-content').each((index, element) => {
            const $el = $(element);
            const text = $el.text().trim();
            if (text.length > 50) { // Only include substantial content
                pageData.content.push({
                    selector: $el.get(0).tagName.toLowerCase() + ($el.attr('class') ? '.' + $el.attr('class').split(' ')[0] : ''),
                    text: text.substring(0, 1000) // Limit length
                });
            }
        });

        // Extract navigation links
        $('nav a, .menu a, .navigation a').each((index, element) => {
            const $el = $(element);
            const href = $el.attr('href');
            const text = $el.text().trim();
            if (href && text) {
                pageData.navigation.push({ text, href });
            }
        });

        // Extract contact information comprehensively
        const pageText = response.data;
        
        // Extract all phone numbers with more aggressive patterns
        const phonePatterns = [
            /(\+260[\d\s\-()]{9,15})/g,                    // Zambian international format
            /(\d{10,})/g,                                  // Long number sequences
            /((?:\+|00)\d{1,3}[\s\-]?\d{6,14})/g,         // International format
            /(\d{3}[\s\-]?\d{3}[\s\-]?\d{4})/g,           // Local format
            /(260[\d\s\-()]{9,})/g,                       // 260 prefix
            /([+]?[\d\s\-()]{10,15})/g                    // Any long digit sequence
        ];
        
        console.log(`[WEB] Searching for phone numbers in ${pageText.length} characters`);
        
        phonePatterns.forEach((pattern, index) => {
            const matches = [...pageText.matchAll(pattern)];
            console.log(`[WEB] Pattern ${index + 1} found ${matches.length} potential matches`);
            matches.forEach(match => {
                const phone = match[1].trim().replace(/\s+/g, ' '); // Normalize spaces
                // Filter out obviously non-phone numbers
                if (phone.length >= 9 && phone.length <= 20 && !pageData.contact.phones.includes(phone)) {
                    pageData.contact.phones.push(phone);
                    console.log(`[WEB] ✅ Found phone on ${url}: ${phone}`);
                }
            });
        });

        // Extract all email addresses with enhanced patterns
        const emailPatterns = [
            /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,     // Standard email
            /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})/g,   // Extended TLD
            /(?:email|mail|contact)[\s:]*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi // With prefixes
        ];
        
        console.log(`[WEB] Searching for email addresses...`);
        
        emailPatterns.forEach((pattern, index) => {
            const matches = [...pageText.matchAll(pattern)];
            console.log(`[WEB] Email pattern ${index + 1} found ${matches.length} potential matches`);
            matches.forEach(match => {
                const email = match[1] ? match[1].trim() : match[0].trim();
                // Clean up any prefixes
                const cleanEmail = email.replace(/^(?:email|mail|contact)[\s:]*/, '');
                if (cleanEmail.includes('@') && !pageData.contact.emails.includes(cleanEmail)) {
                    pageData.contact.emails.push(cleanEmail);
                    console.log(`[WEB] ✅ Found email on ${url}: ${cleanEmail}`);
                }
            });
        });

        // Extract addresses
        const addressPatterns = [
            /address[:\s]*([^.]+(?:zambia|lusaka|ndola|kitwe|street|road|avenue)[^.]*)/gi,
            /located[:\s]*([^.]+(?:zambia|lusaka|ndola|kitwe)[^.]*)/gi,
            /office[:\s]*([^.]+(?:zambia|lusaka|ndola|kitwe)[^.]*)/gi
        ];

        addressPatterns.forEach(pattern => {
            const matches = [...pageText.matchAll(pattern)];
            matches.forEach(match => {
                const address = match[1].trim().substring(0, 200);
                if (address && !pageData.contact.addresses.includes(address)) {
                    pageData.contact.addresses.push(address);
                    console.log(`[WEB] Found address on ${url}: ${address.substring(0, 50)}...`);
                }
            });
        });

        return pageData;

    } catch (error) {
        console.error(`[WEB] Error scraping ${url}: ${error.message}`);
        return null;
    }
}

// Index and consolidate content from all pages
function indexWebsiteContent(allPageData) {
    const consolidatedData = {
        totalPages: allPageData.length,
        contact: {
            phones: [],
            emails: [],
            addresses: [],
            socialMedia: []
        },
        content: {
            about: '',
            services: [],
            navigation: [],
            allText: '',
            headings: []
        },
        pages: allPageData,
        lastIndexed: Date.now()
    };

    // Consolidate all contact information
    allPageData.forEach(page => {
        if (page.contact) {
            consolidatedData.contact.phones.push(...page.contact.phones);
            consolidatedData.contact.emails.push(...page.contact.emails);
            consolidatedData.contact.addresses.push(...page.contact.addresses);
        }
        
        // Collect all headings
        if (page.headings) {
            consolidatedData.content.headings.push(...page.headings);
        }
        
        // Collect all navigation
        if (page.navigation) {
            consolidatedData.content.navigation.push(...page.navigation);
        }
        
        // Collect all content text
        if (page.content) {
            page.content.forEach(section => {
                consolidatedData.content.allText += section.text + ' ';
            });
        }
    });

    // Remove duplicates
    consolidatedData.contact.phones = [...new Set(consolidatedData.contact.phones)];
    consolidatedData.contact.emails = [...new Set(consolidatedData.contact.emails)];
    consolidatedData.contact.addresses = [...new Set(consolidatedData.contact.addresses)];

    // Create searchable about section from all content
    consolidatedData.content.about = consolidatedData.content.allText.substring(0, 2000);

    console.log(`[WEB] 📊 INDEXING COMPLETE - FINAL RESULTS:`);
    console.log(`[WEB] 📱 Total unique phones: ${consolidatedData.contact.phones.length}`);
    if (consolidatedData.contact.phones.length > 0) {
        consolidatedData.contact.phones.forEach(phone => {
            console.log(`[WEB]   📞 ${phone}`);
        });
    }
    
    console.log(`[WEB] 📧 Total unique emails: ${consolidatedData.contact.emails.length}`);
    if (consolidatedData.contact.emails.length > 0) {
        consolidatedData.contact.emails.forEach(email => {
            console.log(`[WEB]   ✉️ ${email}`);
        });
    }
    
    console.log(`[WEB] 📍 Total unique addresses: ${consolidatedData.contact.addresses.length}`);
    if (consolidatedData.contact.addresses.length > 0) {
        consolidatedData.contact.addresses.forEach(address => {
            console.log(`[WEB]   🏢 ${address.substring(0, 100)}...`);
        });
    }
    
    console.log(`[WEB] 📄 Total content sections: ${allPageData.reduce((sum, page) => sum + page.content.length, 0)}`);
    console.log(`[WEB] 🏷️ Total headings: ${consolidatedData.content.headings.length}`);
    console.log(`[WEB] 🔗 Total navigation links: ${consolidatedData.content.navigation.length}`);
    console.log(`[WEB] 📝 Total content characters: ${consolidatedData.content.allText.length}`);

    return consolidatedData;
}

// Intelligent query understanding and rephrasing
function enhanceQueryUnderstanding(query) {
    const queryLower = query.toLowerCase().trim();
    
    // Contact/Phone number patterns
    const phonePatterns = [
        /give me.*number/,
        /what.*number/,
        /their number/,
        /your number/,
        /phone.*number/,
        /contact.*number/,
        /call.*number/,
        /telephone/
    ];
    
    // Address/Location patterns
    const addressPatterns = [
        /where.*they/,
        /their.*location/,
        /their.*address/,
        /where.*located/,
        /find.*them/,
        /visit.*them/,
        /go.*there/
    ];
    
    // Email patterns
    const emailPatterns = [
        /email.*address/,
        /send.*email/,
        /contact.*email/,
        /their.*email/
    ];
    
    // Website patterns
    const websitePatterns = [
        /their.*website/,
        /visit.*website/,
        /web.*site/,
        /online.*presence/
    ];
    
    // Membership patterns
    const membershipPatterns = [
        /how.*join/,
        /become.*member/,
        /join.*them/,
        /sign.*up/,
        /apply.*membership/,
        /membership.*process/
    ];
    
    // Information patterns
    const infoPatterns = [
        /tell me about.*them/,
        /what.*they.*do/,
        /about.*organization/,
        /what.*coaz/,
        /who.*they/
    ];
    
    // Contact patterns (general)
    const contactPatterns = [
        /how.*contact.*them/,
        /contact.*them/,
        /reach.*them/,
        /get.*touch/,
        /speak.*them/
    ];
    
    // Apply enhancements based on patterns
    if (phonePatterns.some(pattern => pattern.test(queryLower))) {
        return "COAZ phone number contact information";
    }
    
    if (addressPatterns.some(pattern => pattern.test(queryLower))) {
        return "COAZ office address location";
    }
    
    if (emailPatterns.some(pattern => pattern.test(queryLower))) {
        return "COAZ email contact information";
    }
    
    if (websitePatterns.some(pattern => pattern.test(queryLower))) {
        return "COAZ website information";
    }
    
    if (membershipPatterns.some(pattern => pattern.test(queryLower))) {
        return "COAZ membership requirements how to join";
    }
    
    if (infoPatterns.some(pattern => pattern.test(queryLower))) {
        return "what is COAZ about organization information";
    }
    
    if (contactPatterns.some(pattern => pattern.test(queryLower))) {
        return "COAZ contact information phone email address";
    }
    
    // If no patterns match, return original query
    return query;
}

// Generate alternative query variations for retry attempts
function generateAlternativeQueries(originalQuery) {
    const queryLower = originalQuery.toLowerCase();
    const alternatives = [];
    
    // For phone number requests
    if (queryLower.includes('number') || queryLower.includes('call') || queryLower.includes('phone')) {
        alternatives.push('COAZ phone number');
        alternatives.push('COAZ contact phone');
        alternatives.push('COAZ telephone number');
        alternatives.push('contact COAZ phone');
    }
    
    // For location requests
    if (queryLower.includes('where') || queryLower.includes('location') || queryLower.includes('address')) {
        alternatives.push('COAZ office address');
        alternatives.push('COAZ location');
        alternatives.push('where is COAZ office');
        alternatives.push('COAZ headquarters address');
    }
    
    // For email requests
    if (queryLower.includes('email') || queryLower.includes('contact')) {
        alternatives.push('COAZ email address');
        alternatives.push('COAZ contact email');
        alternatives.push('contact COAZ email');
    }
    
    // For general contact requests
    if (queryLower.includes('contact') || queryLower.includes('reach')) {
        alternatives.push('COAZ contact information');
        alternatives.push('COAZ contact details');
        alternatives.push('how to contact COAZ');
    }
    
    // Always add a general fallback
    alternatives.push('COAZ contact information');
    
    return alternatives;
}

// Format RAG response with context and proper formatting
function formatRAGResponse(ragResponse, originalQuery) {
    const queryLower = originalQuery.toLowerCase().trim();
    
    // Extract the main answer and context
    const answer = ragResponse.answer || '';
    const confidence = ragResponse.confidence || 0;
    const sections = ragResponse.metadata?.retrievedSections || [];
    
    // Create a contextual header based on the query
    let contextualHeader = "COAZ Information";
    
    if (queryLower.includes('fee') || queryLower.includes('cost') || queryLower.includes('payment')) {
        contextualHeader = "COAZ Membership Fees & Payments";
    } else if (queryLower.includes('membership') || queryLower.includes('member')) {
        contextualHeader = "COAZ Membership Information";
    } else if (queryLower.includes('objective') || queryLower.includes('purpose') || queryLower.includes('mission')) {
        contextualHeader = "COAZ Objectives & Mission";
    } else if (queryLower.includes('committee') || queryLower.includes('board') || queryLower.includes('leadership')) {
        contextualHeader = "COAZ Leadership & Governance";
    } else if (queryLower.includes('training') || queryLower.includes('education') || queryLower.includes('cpd')) {
        contextualHeader = "COAZ Education & Training";
    } else if (queryLower.includes('election') || queryLower.includes('voting')) {
        contextualHeader = "COAZ Elections & Procedures";
    }
    
    // Start building the formatted response
    let formattedResponse = `<strong>${contextualHeader}</strong><br><br>`;
    
    // Clean and format the main answer
    let cleanAnswer = answer
        .replace(/\s+/g, ' ')  // Normalize spaces
        .replace(/\n+/g, ' ')  // Remove line breaks
        .trim();
    
    // Add context to the answer
    if (cleanAnswer.length > 0) {
        // Capitalize first letter if needed
        cleanAnswer = cleanAnswer.charAt(0).toUpperCase() + cleanAnswer.slice(1);
        
        // Add period if missing
        if (!cleanAnswer.endsWith('.') && !cleanAnswer.endsWith('!') && !cleanAnswer.endsWith('?')) {
            cleanAnswer += '.';
        }
        
        formattedResponse += `${cleanAnswer}<br><br>`;
    }
    
    // Add relevant sections if available
    if (sections && sections.length > 0) {
        formattedResponse += `<strong>Related Constitutional Provisions:</strong><br>`;
        sections.slice(0, 2).forEach((section, index) => {
            const sectionText = section.content || section.text || section;
            if (typeof sectionText === 'string' && sectionText.length > 20) {
                const cleanSection = sectionText
                    .replace(/\s+/g, ' ')
                    .trim()
                    .substring(0, 300);
                formattedResponse += `• ${cleanSection}${cleanSection.length === 300 ? '...' : ''}<br>`;
            }
        });
        formattedResponse += `<br>`;
    }
    
    // Add confidence and source information
    const confidenceLevel = confidence >= 0.7 ? 'High' : confidence >= 0.4 ? 'Medium' : 'Low';
    const confidenceEmoji = confidence >= 0.7 ? '✅' : confidence >= 0.4 ? '⚠️' : '❓';
    
    formattedResponse += `<strong>Source Information:</strong><br>`;
    formattedResponse += `${confidenceEmoji} <strong>Confidence Level:</strong> ${confidenceLevel} (${(confidence * 100).toFixed(0)}%)<br>`;
    formattedResponse += `📄 <strong>Source:</strong> COAZ Constitution & Official Documents<br>`;
    
    if (sections && sections.length > 0) {
        formattedResponse += `📊 <strong>References:</strong> ${sections.length} relevant section${sections.length > 1 ? 's' : ''} found<br>`;
    }
    
    formattedResponse += `<br><em>This information is sourced directly from the COAZ constitution and official documents.</em>`;
    
    return formattedResponse;
}

// Enhanced query processing with comprehensive website data
async function getWebsiteContext(query) {
    const queryLower = query.toLowerCase();
    
    // Get comprehensive website data for ANY query that might benefit from website content
    const websiteData = await scrapeCoazWebsite();
    if (!websiteData) {
        return { hasContext: false };
    }
    
    // Search through all website content for relevant information
    const relevantContent = searchWebsiteContent(query, websiteData);
    
    if (relevantContent.length > 0) {
        console.log(`[WEB] Found ${relevantContent.length} relevant content matches for: "${query}"`);
        return {
            hasContext: true,
            type: 'content',
            data: websiteData,
            relevantContent: relevantContent
        };
    }
    
    // Check for specific contact queries
    const contactPatterns = [
        /where.*(?:are you|is coaz|located|office|headquarter)/,
        /(?:coaz|you).*(?:location|address|office|contact)/,
        /phone|number|email|contact.*information/,
        /how.*contact|reach.*them/
    ];
    
    const isContactQuery = contactPatterns.some(pattern => pattern.test(queryLower));
    
    if (isContactQuery && (websiteData.contact.phones.length > 0 || websiteData.contact.emails.length > 0)) {
        return {
            hasContext: true,
            type: 'contact',
            data: websiteData
        };
    }

    return { hasContext: false };
}

// Search through website content for relevant information
function searchWebsiteContent(query, websiteData) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    const relevantContent = [];
    
    // Search through all pages
    websiteData.pages.forEach(page => {
        // Search page title
        if (page.title && queryWords.some(word => page.title.toLowerCase().includes(word))) {
            relevantContent.push({
                type: 'title',
                source: page.url,
                content: page.title,
                relevance: 'high'
            });
        }
        
        // Search headings
        page.headings.forEach(heading => {
            if (queryWords.some(word => heading.text.toLowerCase().includes(word))) {
                relevantContent.push({
                    type: 'heading',
                    source: page.url,
                    content: heading.text,
                    level: heading.level,
                    relevance: 'medium'
                });
            }
        });
        
        // Search content sections
        page.content.forEach(section => {
            const matchingWords = queryWords.filter(word => section.text.toLowerCase().includes(word));
            if (matchingWords.length > 0) {
                // Extract relevant excerpt around the matching words
                const excerpt = extractRelevantExcerpt(section.text, matchingWords);
                relevantContent.push({
                    type: 'content',
                    source: page.url,
                    content: excerpt,
                    matchingWords: matchingWords,
                    relevance: matchingWords.length > 1 ? 'high' : 'medium'
                });
            }
        });
        
        // Search navigation for relevant sections
        page.navigation.forEach(nav => {
            if (queryWords.some(word => nav.text.toLowerCase().includes(word))) {
                relevantContent.push({
                    type: 'navigation',
                    source: page.url,
                    content: nav.text,
                    href: nav.href,
                    relevance: 'low'
                });
            }
        });
    });
    
    // Sort by relevance and limit results
    relevantContent.sort((a, b) => {
        const relevanceOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return relevanceOrder[b.relevance] - relevanceOrder[a.relevance];
    });
    
    return relevantContent.slice(0, 5); // Top 5 most relevant results
}

// Extract relevant excerpt around matching words
function extractRelevantExcerpt(text, matchingWords) {
    const textLower = text.toLowerCase();
    let bestStart = 0;
    let maxMatches = 0;
    
    // Find the position with the most matching words in a 200-character window
    for (let i = 0; i < text.length - 200; i += 50) {
        const window = textLower.substring(i, i + 200);
        const matches = matchingWords.filter(word => window.includes(word)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestStart = i;
        }
    }
    
    const excerpt = text.substring(bestStart, bestStart + 300);
    return excerpt.trim() + (bestStart + 300 < text.length ? '...' : '');
}

// Determine if query needs constitution context OR web scraping (UPDATED VERSION)
function needsConstitutionContext(query) {
    console.log(`[CLASSIFICATION-DEBUG] Testing query: "${query}"`);
    const constitutionKeywords = [
        'constitution', 'article', 'section', 'rule', 'regulation', 'membership', 'member',
        'objective', 'purpose', 'committee', 'board', 'election', 'duties', 'join',
        'responsibilities', 'amendment', 'bylaws', 'governance', 'structure',
        'coaz', 'college of anesthesiologists', 'anesthesiologist', 'anesthesia',
        'professional', 'qualification', 'requirement', 'certification', 'requirements',
        'license', 'practice', 'ethics', 'disciplinary', 'meeting', 'apply',
        'procedure', 'standard', 'guideline', 'policy', 'officer', 'become',
        'president', 'secretary', 'treasurer', 'executive', 'council', 'fee', 'fees',
        'benefit', 'benefits', 'training', 'education', 'cpd', 'what is coaz',
        'about coaz', 'tell me about', 'explain', 'describe coaz',
        // Contact-related keywords that should trigger processing
        'phone', 'number', 'email', 'contact', 'address', 'location', 'office',
        'call', 'reach', 'their', 'them', 'where', 'how to contact',
        // Website content-related keywords that should trigger web scraping
        'services', 'programs', 'events', 'news', 'courses', 'workshops',
        'conferences', 'activities', 'resources', 'information', 'about',
        'mission', 'vision', 'history', 'team', 'staff', 'leadership',
        'partners', 'sponsors', 'announcements', 'updates'
    ];

    const queryLower = query.toLowerCase().trim();

    // Check for general greetings/phrases that DON'T need constitution
    const generalPhrases = [
        'hello', 'hi', 'hey', 'how are you', 'what are you', 'who are you',
        'are you real', 'are you ai', 'are you human', 'good morning',
        'good afternoon', 'good evening', 'thank you', 'thanks', 'bye',
        'goodbye', 'see you', 'ok', 'okay', 'yes', 'no', 'maybe', 
        'please', 'sorry', 'excuse me'
    ];

    // If it's EXACTLY a general greeting/phrase, skip constitution
    if (generalPhrases.some(phrase => queryLower === phrase)) {
        return false;
    }

    // Check for contact-related patterns that should be processed
    const contactPatterns = [
        /give me.*number/,
        /their.*number/,
        /what.*number/,
        /phone.*number/,
        /email.*address/,
        /where.*they/,
        /where.*located/,
        /contact.*them/,
        /reach.*them/,
        /their.*email/
    ];
    
    if (contactPatterns.some(pattern => pattern.test(queryLower))) {
        console.log(`[CLASSIFICATION] Contact pattern detected in: "${query}"`);
        return true;
    }

    // Check for multi-word phrases first (more specific matches)
    const constitutionPhrases = [
        'tell me about', 'what is coaz', 'about coaz', 'describe coaz',
        'explain coaz', 'tell me about membership', 'what are the objectives',
        'how to join', 'how to become', 'membership requirements'
    ];
    
    if (constitutionPhrases.some(phrase => queryLower.includes(phrase))) {
        return true;
    }

    // If it contains constitution keywords, use RAG
    return constitutionKeywords.some(keyword => queryLower.includes(keyword));
}

// This old formatRAGResponse function is replaced by the enhanced one above

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
        
        console.log(`[DEBUG] Query: "${query}" | UseRag: ${useRag} | NeedsConstitution: ${needsConstitutionContext(query)} | ShouldUseRag: ${shouldUseRag}`);

        // INTELLIGENT QUERY UNDERSTANDING - Rephrase ambiguous queries
        console.log('[INTELLIGENT] Analyzing and rephrasing query if needed...');
        const originalQuery = query;
        const enhancedQuery = enhanceQueryUnderstanding(query);
        
        console.log(`[INTELLIGENT] Original: "${originalQuery}"`);
        console.log(`[INTELLIGENT] Enhanced: "${enhancedQuery}"`);
        console.log(`[INTELLIGENT] Changed: ${enhancedQuery !== originalQuery}`);
        
        if (enhancedQuery !== originalQuery) {
            console.log(`[INTELLIGENT] ✅ Rephrased: "${originalQuery}" → "${enhancedQuery}"`);
            query = enhancedQuery; // Use enhanced query for processing
        } else {
            console.log(`[INTELLIGENT] ❌ No rephrasing needed for: "${originalQuery}"`);
        }

        // PRIORITY 1: Web Scraping - Check for website context first (location/contact queries)
        console.log('[PRIORITY] Checking web scraping context...');
        let websiteContext = await getWebsiteContext(query);
        
        // If web scraping fails and original query was rephrased, try with more specific patterns
        if (!websiteContext.hasContext && enhancedQuery !== originalQuery) {
            console.log('[PRIORITY] Web scraping failed, trying alternative patterns...');
            const alternativeQueries = generateAlternativeQueries(originalQuery);
            for (const altQuery of alternativeQueries) {
                console.log(`[PRIORITY] Trying alternative: "${altQuery}"`);
                websiteContext = await getWebsiteContext(altQuery);
                if (websiteContext.hasContext) {
                    console.log(`[PRIORITY] Success with alternative query!`);
                    break;
                }
            }
        }
        
        if (websiteContext.hasContext) {
            console.log('[WEB] Using website context for response');
            const websiteData = websiteContext.data;
            
            if (websiteContext.type === 'content') {
                // Generate response from website content
                let contentResponse = `<strong>Information from COAZ Website</strong><br><br>`;
                contentResponse += `<em>Found relevant information from ${websiteData.totalPages} pages on the COAZ website:</em><br><br>`;
                
                websiteContext.relevantContent.forEach((item, index) => {
                    if (item.type === 'title') {
                        contentResponse += `<strong>📄 Page: ${item.content}</strong><br>`;
                    } else if (item.type === 'heading') {
                        contentResponse += `<strong>📋 ${item.content}</strong><br>`;
                    } else if (item.type === 'content') {
                        contentResponse += `${item.content}<br><br>`;
                    }
                    
                    if (index < websiteContext.relevantContent.length - 1) {
                        contentResponse += `<br>`;
                    }
                });
                
                // Add source information
                const uniqueSources = [...new Set(websiteContext.relevantContent.map(item => item.source))];
                contentResponse += `<br><strong>🔗 Sources:</strong><br>`;
                uniqueSources.forEach(source => {
                    contentResponse += `• <a href="${source}" target="_blank">${source}</a><br>`;
                });
                
                contentResponse += `<br><em>Information last updated: ${new Date(websiteData.lastIndexed).toLocaleString()}</em>`;
                
                return res.json({
                    sender: "bot",
                    text: contentResponse,
                    responseType: "website_content_search"
                });
            } else if (websiteContext.type === 'contact') {
                let contactResponse = `<strong>COAZ Contact Information</strong><br><br>`;
                contactResponse += `<em>Information sourced from comprehensive scan of ${websiteData.totalPages} pages on the COAZ website:</em><br><br>`;
                
                // Display all found phone numbers
                if (websiteData.contact.phones && websiteData.contact.phones.length > 0) {
                    contactResponse += `<strong>📞 Phone Numbers:</strong><br>`;
                    websiteData.contact.phones.forEach(phone => {
                        contactResponse += `• ${phone}<br>`;
                    });
                    contactResponse += `<br>`;
                } else {
                    contactResponse += `<strong>📞 Phone:</strong><br>Contact information available on website<br><br>`;
                }
                
                // Display all found email addresses
                if (websiteData.contact.emails && websiteData.contact.emails.length > 0) {
                    contactResponse += `<strong>📧 Email Addresses:</strong><br>`;
                    websiteData.contact.emails.forEach(email => {
                        contactResponse += `• ${email}<br>`;
                    });
                    contactResponse += `<br>`;
                }
                
                // Display all found addresses
                if (websiteData.contact.addresses && websiteData.contact.addresses.length > 0) {
                    contactResponse += `<strong>📍 Addresses:</strong><br>`;
                    websiteData.contact.addresses.forEach(address => {
                        contactResponse += `• ${address}<br>`;
                    });
                    contactResponse += `<br>`;
                } else {
                    contactResponse += `<strong>📍 Location:</strong><br>COAZ is located in Zambia.<br><br>`;
                }
                
                contactResponse += `<strong>🌐 Website:</strong><br><a href="${config.webScraping.coazWebsite}" target="_blank">${config.webScraping.coazWebsite}</a><br><br>`;
                contactResponse += `<em>Last updated: ${new Date(websiteData.lastIndexed).toLocaleString()}</em>`;
                
                return res.json({
                    sender: "bot",
                    text: contactResponse,
                    responseType: "website_contact_comprehensive"
                });
            }
        }

        // PRIORITY 2: Document Search (RAG/Constitution)
        console.log('[PRIORITY] Checking document context...');
        const queryLower = query.toLowerCase().trim();

        if (shouldUseRag) {
            console.log("[DOCUMENT] Using RAG system for constitution query...");

            try {
                ragResponse = await ragSystem.processQuery(query);

                // If RAG provides a confident answer, use it with enhanced formatting
                if (ragResponse.confidence > 0.1 && ragResponse.hasRelevantContext) {
                    console.log(`[DOCUMENT] RAG Success - Confidence: ${ragResponse.confidence.toFixed(2)}`);
                    console.log(`[DOCUMENT] Raw RAG answer: "${ragResponse.answer}"`);
                    
                    response = formatRAGResponse(ragResponse, query);
                    responseType = "rag_qa_formatted";
                    
                    console.log(`[DOCUMENT] Formatted RAG response length: ${response.length}`);
                    
                    return res.json({
                        sender: "bot",
                        text: response,
                        responseType: responseType
                    });
                } else {
                    console.log(`[DOCUMENT] RAG Low confidence (${ragResponse.confidence.toFixed(2)}), proceeding to next priority...`);
                }
            } catch (ragError) {
                console.error("[DOCUMENT] RAG System error:", ragError.message);
            }
        }

        // Constitution search as document fallback with retry logic
        if (needsConstitutionContext(query)) {
            console.log("[DOCUMENT] Searching constitution for context...");
            let searchResults = searchConstitution(query);

            // If no results and query was enhanced, try alternatives
            if ((searchResults.length === 0 || searchResults[0].startsWith("[ERROR]")) && enhancedQuery !== originalQuery) {
                console.log("[DOCUMENT] First search failed, trying alternative patterns...");
                const alternativeQueries = generateAlternativeQueries(originalQuery);
                for (const altQuery of alternativeQueries) {
                    console.log(`[DOCUMENT] Trying alternative: "${altQuery}"`);
                    searchResults = searchConstitution(altQuery);
                    if (searchResults.length > 0 && !searchResults[0].startsWith("[ERROR]")) {
                        console.log(`[DOCUMENT] Success with alternative query!`);
                        break;
                    }
                }
            }

            if (searchResults.length > 0 && !searchResults[0].startsWith("[ERROR]")) {
                const constitutionContext = searchResults.slice(0, 2).join("\n\n");
                
                if (config.offlineResponse.enabled) {
                    console.log("[DOCUMENT] Using enhanced offline response with constitution context");
                    response = generateOfflineResponse(query, constitutionContext);
                    responseType = "offline_enhanced";
                    
                    return res.json({
                        sender: "bot",
                        text: response,
                        responseType: responseType
                    });
                }
            }
        }

        // PRIORITY 3: Simple Factual Responses
        console.log('[PRIORITY] Checking simple factual patterns...');
        
        // Simple factual questions that need immediate short answers
        if (queryLower.includes('coaz') && queryLower.includes('zambia') && (queryLower.includes('is') || queryLower.includes('in'))) {
            return res.json({
                sender: "bot",
                text: `Yes, COAZ (College of Anesthesiologists of Zambia) is indeed in Zambia. It's the professional medical organization for anesthesiologists in the country.`,
                responseType: "factual_short"
            });
        }

        if (queryLower.includes('what does coaz stand for') || queryLower.includes('coaz stands for')) {
            return res.json({
                sender: "bot",
                text: `COAZ stands for "College of Anesthesiologists of Zambia".`,
                responseType: "factual_short"
            });
        }

        if (queryLower.includes('full form') && queryLower.includes('coaz')) {
            return res.json({
                sender: "bot",
                text: `The full form of COAZ is "College of Anesthesiologists of Zambia".`,
                responseType: "factual_short"
            });
        }

        if (queryLower.includes('join') && queryLower.includes('coaz') && queryLower.length < 30) {
            return res.json({
                sender: "bot",
                text: `To join COAZ, you need a medical degree, anesthesiology training, and valid Zambian medical registration. Apply through the COAZ membership committee.`,
                responseType: "factual_short"
            });
        }

        // PRIORITY 4: Generic AI/Offline Response
        console.log('[PRIORITY] Using generic response system...');
        
        response = null;
        responseType = "generic";

        if (config.offlineResponse.enabled) {
            console.log("[GENERIC] Using enhanced offline response system");
            response = generateOfflineResponse(query, null);
            responseType = "offline_generic";
        } else {
            console.log("[GENERIC] Using AI response system");
            try {
                response = await generateIntelligentResponse(query, null, sessionId);
                responseType = "ai_general";
            } catch (error) {
                console.log("[GENERIC] AI failed, using basic fallback");
                response = `I understand you're asking about "${query}". I'm having trouble generating a detailed response right now. Please try rephrasing your question or contact COAZ directly for assistance.`;
                responseType = "basic_fallback";
            }
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

// Configuration endpoint to toggle offline responses
app.post('/api/config/offline-response', (req, res) => {
    try {
        const { enabled, fallbackOnly, forceSimpleAnswers } = req.body;
        
        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: "enabled must be a boolean value" });
        }
        
        // Update configuration
        config.offlineResponse.enabled = enabled;
        if (fallbackOnly !== undefined) config.offlineResponse.fallbackOnly = fallbackOnly;
        if (forceSimpleAnswers !== undefined) config.offlineResponse.forceSimpleAnswers = forceSimpleAnswers;
        
        logger.info(`Offline response configuration updated`, {
            enabled: config.offlineResponse.enabled,
            fallbackOnly: config.offlineResponse.fallbackOnly,
            forceSimpleAnswers: config.offlineResponse.forceSimpleAnswers,
            service: 'coaz-chatbot'
        });
        
        res.json({
            success: true,
            message: 'Offline response configuration updated',
            config: config.offlineResponse
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current configuration
app.get('/api/config', (req, res) => {
    try {
        res.json({
            ai: {
                provider: config.ai.provider,
                fallbackToOffline: config.ai.fallbackToOffline
            },
            rag: config.rag,
            offlineResponse: config.offlineResponse,
            environment: config.nodeEnv,
            serverStatus: {
                constitutionLoaded: constitutionSections.length > 0,
                ragInitialized: !!ragSystem,
                sectionsCount: constitutionSections.length
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
    
    app.listen(PORT, async () => {
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
        
        // Start comprehensive website indexing on server startup
        console.log(`\n🕷️  === STARTUP WEBSITE INDEXING ===`);
        console.log(`🔍 Starting comprehensive crawl of ${config.webScraping.coazWebsite}`);
        console.log(`⏱️  This may take a moment...`);
        
        try {
            const startTime = Date.now();
            const websiteData = await scrapeCoazWebsite();
            const endTime = Date.now();
            
            if (websiteData) {
                console.log(`\n✅ === WEBSITE INDEXING COMPLETE ===`);
                console.log(`⏱️  Total time: ${((endTime - startTime) / 1000).toFixed(1)} seconds`);
                console.log(`📊 Final Results:`);
                console.log(`   📄 Total pages indexed: ${websiteData.totalPages}`);
                console.log(`   📱 Phone numbers found: ${websiteData.contact.phones.length}`);
                console.log(`   📧 Email addresses found: ${websiteData.contact.emails.length}`);
                console.log(`   📍 Addresses found: ${websiteData.contact.addresses.length}`);
                console.log(`   📝 Content sections: ${websiteData.pages.reduce((sum, page) => sum + (page.content?.length || 0), 0)}`);
                console.log(`   🏷️  Headings extracted: ${websiteData.pages.reduce((sum, page) => sum + (page.headings?.length || 0), 0)}`);
                console.log(`   🔗 Navigation links: ${websiteData.pages.reduce((sum, page) => sum + (page.navigation?.length || 0), 0)}`);
                console.log(`\n🎉 COAZ Website is now fully indexed and ready for intelligent queries!`);
                console.log(`💡 Users can now ask about services, programs, events, and more from the live website.`);
                console.log(`=====================================\n`);
            } else {
                console.log(`\n❌ Website indexing failed - chatbot will use fallback responses`);
                console.log(`=====================================\n`);
            }
        } catch (error) {
            console.error(`\n❌ Error during startup website indexing: ${error.message}`);
            console.log(`📝 Chatbot will continue with constitution and offline responses only`);
            console.log(`=====================================\n`);
        }
    });
})();
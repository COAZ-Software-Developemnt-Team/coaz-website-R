// Multi-provider AI system with working endpoints and smart fallbacks
const axios = require('axios');

class MultiProviderAISystem {
    constructor(config = {}) {
        this.config = {
            primaryProvider: config.primaryProvider || 'ai_horde',
            fallbackToMock: config.fallbackToMock !== false,
            timeout: config.timeout || 15000,
            maxRetries: config.maxRetries || 2,
            ...config
        };

        // Available providers with their configurations
        this.providers = {
            ai_horde: {
                name: 'AI Horde - Kobold',
                url: 'https://koboldai.net/api/latest/generate',
                type: 'kobold_horde',
                working: true,
                requiresAuth: false
            },
            transformers_js: {
                name: 'Transformers.js Local',
                type: 'transformers_js',
                working: false, // Will be tested at runtime
                requiresAuth: false
            },
            mock: {
                name: 'Mock AI Responses',
                type: 'mock',
                working: true,
                requiresAuth: false
            }
        };

        // Knowledge sources (raw text)
        this.websiteContent = [];
        this.pdfContent = [];
        this.combinedKnowledge = '';

        // Conversation patterns for mock responses
        this.mockPatterns = this.initializeMockPatterns();

        console.log(`[AI] Multi-provider AI System initialized`);
        console.log(`[AI] Primary provider: ${this.config.primaryProvider}`);
        console.log(`[AI] Available providers: ${Object.keys(this.providers).join(', ')}`);
    }

    // Initialize comprehensive mock response patterns
    initializeMockPatterns() {
        return {
            // COAZ specific patterns
            coaz: {
                patterns: [
                    /what is coaz/i,
                    /about coaz/i,
                    /coaz.*about/i,
                    /college.*anesthesiologists/i
                ],
                responses: [
                    "COAZ stands for the College of Anesthesiologists of Zambia. It's the professional organization for anesthesiologists in Zambia, dedicated to advancing anesthesiology practice, education, and advocacy for healthcare professionals in the field.",
                    "The College of Anesthesiologists of Zambia (COAZ) is a professional body that supports anesthesiologists through continuing professional development, certification programs, and advocacy for improved healthcare standards in Zambia.",
                    "COAZ represents anesthesiologists in Zambia, providing professional development opportunities, maintaining practice standards, and advocating for the advancement of anesthesiology in the country's healthcare system."
                ]
            },
            
            // Membership related
            membership: {
                patterns: [
                    /membership/i,
                    /join.*coaz/i,
                    /become.*member/i,
                    /member.*requirement/i,
                    /how.*join/i
                ],
                responses: [
                    "To join COAZ, you typically need to be a qualified anesthesiologist or anesthesia professional. Membership requirements include relevant medical qualifications, professional registration, and commitment to continuing professional development.",
                    "COAZ membership is open to qualified anesthesiology professionals. Benefits include access to continuing education, professional networking, advocacy representation, and certification programs.",
                    "Membership with COAZ provides access to professional development opportunities, industry updates, networking events, and advocacy for anesthesiology professionals in Zambia."
                ]
            },
            
            // AGM and events
            agm: {
                patterns: [
                    /agm/i,
                    /annual.*general.*meeting/i,
                    /meeting/i,
                    /conference/i,
                    /event/i
                ],
                responses: [
                    "The COAZ Annual General Meeting (AGM) is an important event where members gather to discuss association matters, elect leadership, and participate in professional development activities.",
                    "COAZ regularly organizes professional events, conferences, and the Annual General Meeting to bring together anesthesiology professionals for learning, networking, and association governance.",
                    "The AGM and other COAZ events provide opportunities for continuing professional development, networking with colleagues, and staying updated on developments in anesthesiology practice."
                ]
            },
            
            // CPD and education
            cpd: {
                patterns: [
                    /cpd/i,
                    /continuing.*professional.*development/i,
                    /education/i,
                    /training/i,
                    /course/i,
                    /learning/i
                ],
                responses: [
                    "COAZ offers Continuing Professional Development (CPD) programs to help anesthesiologists maintain and enhance their skills, stay current with best practices, and meet professional requirements.",
                    "CPD activities through COAZ include workshops, seminars, conferences, and training programs designed to advance knowledge and skills in anesthesiology practice.",
                    "Professional development is a core focus of COAZ, providing members with access to educational resources, training opportunities, and certification programs."
                ]
            },
            
            // General medical/anesthesia
            anesthesia: {
                patterns: [
                    /anesthesia/i,
                    /anesthesiology/i,
                    /anesthetic/i,
                    /surgery/i,
                    /medical.*practice/i
                ],
                responses: [
                    "Anesthesiology is a critical medical specialty focused on providing safe and effective anesthesia care during surgical procedures, pain management, and critical care medicine.",
                    "COAZ supports the advancement of anesthesiology practice in Zambia through professional standards, education, and advocacy for improved patient care and safety.",
                    "Anesthesiologists play a vital role in healthcare, ensuring patient safety and comfort during surgical procedures while managing pain and providing critical care support."
                ]
            },
            
            // Greetings and general
            greetings: {
                patterns: [
                    /^(hello|hi|hey|good\s+(morning|afternoon|evening)|greetings)/i,
                    /how.*are.*you/i,
                    /thanks?/i,
                    /thank\s*you/i
                ],
                responses: [
                    "Hello! I'm your COAZ AI assistant. I'm here to help you with information about the College of Anesthesiologists of Zambia. What would you like to know?",
                    "Hi there! I can help you with questions about COAZ, membership, anesthesiology, professional development, and more. How can I assist you?",
                    "Greetings! I'm here to provide information about the College of Anesthesiologists of Zambia. Feel free to ask me about membership, events, CPD, or any other COAZ-related topics."
                ]
            },
            
            // Contact and locations
            contact: {
                patterns: [
                    /contact/i,
                    /phone/i,
                    /email/i,
                    /address/i,
                    /location/i,
                    /office/i
                ],
                responses: [
                    "For contact information and office locations, please visit the official COAZ website or refer to the latest member communications for the most current details.",
                    "You can reach COAZ through their official channels. Contact details are typically provided in member communications and on the official website.",
                    "COAZ maintains official contact information for member inquiries. Please check the latest communications or website for current contact details."
                ]
            }
        };
    }

    // Load website content (raw text array)
    loadWebsiteContent(websiteData) {
        try {
            this.websiteContent = [];
            
            if (websiteData && websiteData.pages && Array.isArray(websiteData.pages)) {
                for (const page of websiteData.pages) {
                    if (page.content && typeof page.content === 'string' && page.content.trim().length > 50) {
                        const cleanContent = this.cleanTextContent(page.content);
                        if (cleanContent.length > 100) {
                            this.websiteContent.push({
                                url: page.url || 'Unknown URL',
                                title: page.title || 'Untitled',
                                content: cleanContent
                            });
                        }
                    }
                }
            }
            
            this.updateCombinedKnowledge();
            console.log(`[AI] Loaded ${this.websiteContent.length} website pages into knowledge base`);
            
        } catch (error) {
            console.error('[AI] Error loading website content:', error.message);
        }
    }

    // Load PDF content (raw text)
    loadPdfContent(pdfText) {
        try {
            if (pdfText && typeof pdfText === 'string' && pdfText.trim().length > 100) {
                const sections = pdfText
                    .split(/(?=\b[A-Z][A-Za-z ]+\b)/g)
                    .map(section => section.trim())
                    .filter(section => section.length > 100);

                this.pdfContent = sections.map((section, index) => ({
                    source: 'PDF Document',
                    section: `Section ${index + 1}`,
                    content: this.cleanTextContent(section)
                }));

                this.updateCombinedKnowledge();
                console.log(`[AI] Loaded PDF content with ${this.pdfContent.length} sections into knowledge base`);
            }
        } catch (error) {
            console.error('[AI] Error loading PDF content:', error.message);
        }
    }

    // Combine all knowledge sources
    updateCombinedKnowledge() {
        const allContent = [];
        
        this.websiteContent.forEach(item => {
            allContent.push(`[WEBSITE: ${item.title}]\n${item.content}`);
        });
        
        this.pdfContent.forEach(item => {
            allContent.push(`[PDF: ${item.section}]\n${item.content}`);
        });
        
        this.combinedKnowledge = allContent.join('\n\n---\n\n');
        console.log(`[AI] Combined knowledge base updated: ${this.combinedKnowledge.length} characters`);
    }

    // Clean text content
    cleanTextContent(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s.,!?;:()\-"']/g, '')
            .trim();
    }

    // Find relevant content for a query
    findRelevantContent(query, maxChunks = 3) {
        const queryLower = query.toLowerCase();
        const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 2);
        
        const allPieces = [
            ...this.websiteContent.map(item => ({ ...item, type: 'website' })),
            ...this.pdfContent.map(item => ({ ...item, type: 'pdf' }))
        ];
        
        const scoredPieces = allPieces.map(piece => {
            const contentLower = piece.content.toLowerCase();
            let score = 0;
            
            queryTerms.forEach(term => {
                const matches = (contentLower.match(new RegExp(term, 'g')) || []).length;
                score += matches * 2;
            });
            
            if (contentLower.includes(queryLower)) {
                score += 10;
            }
            
            return { ...piece, score };
        });
        
        return scoredPieces
            .sort((a, b) => b.score - a.score)
            .slice(0, maxChunks)
            .filter(piece => piece.score > 0);
    }

    // Generate response using AI Horde
    async generateAIHordeResponse(query, context) {
        const url = this.providers.ai_horde.url;
        
        const prompt = `You are a helpful assistant for the College of Anesthesiologists of Zambia (COAZ). 
        
Context: ${context.substring(0, 800)}

Question: ${query}

Please provide a helpful and accurate response:`;

        const requestData = {
            prompt: prompt,
            max_length: 150,
            temperature: 0.7,
            rep_pen: 1.1,
            top_p: 0.9
        };

        const response = await axios.post(url, requestData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: this.config.timeout
        });

        // AI Horde returns HTML, need to parse for actual response
        if (response.data && typeof response.data === 'string') {
            // Check for placeholder/template responses and reject them
            if (response.data.includes('${') || 
                response.data.includes('stash_image_placeholders') ||
                response.data.includes('curr.msg')) {
                throw new Error('AI Horde returned template/placeholder response');
            }
            
            // Look for generated text in the response
            const textMatch = response.data.match(/<div[^>]*class="[^"]*output[^"]*"[^>]*>(.*?)<\/div>/s) ||
                            response.data.match(/<textarea[^>]*>(.*?)<\/textarea>/s) ||
                            response.data.match(/generated[^>]*>([^<]+)</i) ||
                            response.data.match(/"generated_text":\s*"([^"]+)"/);
            
            if (textMatch && textMatch[1] && 
                !textMatch[1].includes('${') && 
                !textMatch[1].includes('stash_image_placeholders')) {
                return this.cleanModelResponse(textMatch[1]);
            }
        }
        
        // If we can't parse the response properly, throw error to use fallback
        throw new Error('Could not parse AI Horde response or got template content');
    }

    // Generate mock response based on patterns
    generateMockResponse(query) {
        const queryLower = query.toLowerCase();
        
        // Check each pattern category
        for (const [category, data] of Object.entries(this.mockPatterns)) {
            for (const pattern of data.patterns) {
                if (pattern.test(queryLower)) {
                    const responses = data.responses;
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    console.log(`[AI] Mock response triggered by category: ${category}`);
                    return randomResponse;
                }
            }
        }
        
        // Check if we have relevant content in knowledge base
        const relevantContent = this.findRelevantContent(query, 1);
        if (relevantContent.length > 0) {
            const content = relevantContent[0].content.substring(0, 300);
            return `Based on available information: ${content}...`;
        }
        
        // Generic fallback
        return "Thank you for your question about COAZ. While I don't have specific information about that topic right now, I'd recommend checking the official COAZ website or contacting them directly for the most accurate and up-to-date information.";
    }

    // Main response generation method
    async generateResponse(query, sessionHistory = []) {
        const startTime = Date.now();
        
        try {
            // Find relevant content
            const relevantContent = this.findRelevantContent(query);
            const contextText = relevantContent
                .map(piece => piece.content.substring(0, 400))
                .join('\n\n');
            
            let response;
            let provider = this.config.primaryProvider;
            
            // Try primary provider first
            if (provider === 'ai_horde' && this.providers.ai_horde.working) {
                try {
                    console.log(`[AI] Attempting AI Horde response...`);
                    response = await this.generateAIHordeResponse(query, contextText);
                    
                    if (response && response.length > 10) {
                        const processingTime = Date.now() - startTime;
                        return {
                            text: response,
                            provider: 'ai_horde',
                            model: 'AI Horde - Kobold',
                            relevantSources: relevantContent.length,
                            processingTime
                        };
                    }
                } catch (hordeError) {
                    console.warn('[AI] AI Horde failed:', hordeError.message);
                }
            }
            
            // Fallback to mock response
            if (this.config.fallbackToMock) {
                console.log('[AI] Using mock response system');
                response = this.generateMockResponse(query);
                
                const processingTime = Date.now() - startTime;
                return {
                    text: response,
                    provider: 'mock',
                    model: 'Pattern-based Mock AI',
                    relevantSources: relevantContent.length,
                    processingTime
                };
            }
            
            throw new Error('All providers failed and fallback disabled');
            
        } catch (error) {
            console.error('[AI] Error generating response:', error.message);
            
            // Emergency fallback
            const processingTime = Date.now() - startTime;
            return {
                text: "I apologize, but I'm experiencing technical difficulties. Please try again or contact COAZ directly for assistance.",
                provider: 'emergency',
                model: 'Emergency Fallback',
                relevantSources: 0,
                processingTime
            };
        }
    }

    // Clean model response
    cleanModelResponse(text) {
        if (!text) return "I apologize, but I couldn't generate a response. Please try again.";
        
        return text
            .trim()
            .replace(/^(Assistant:|AI:|Response:)\s*/i, '')
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .trim();
    }

    // Get system statistics
    getStats() {
        return {
            primaryProvider: this.config.primaryProvider,
            availableProviders: Object.keys(this.providers),
            workingProviders: Object.keys(this.providers).filter(p => this.providers[p].working),
            websitePages: this.websiteContent.length,
            pdfSections: this.pdfContent.length,
            totalKnowledgeSize: this.combinedKnowledge.length,
            mockPatterns: Object.keys(this.mockPatterns).length
        };
    }

    // Switch provider
    switchProvider(newProvider) {
        if (this.providers[newProvider]) {
            this.config.primaryProvider = newProvider;
            console.log(`[AI] Switched to ${newProvider} provider`);
            return true;
        }
        return false;
    }

    // Test provider availability
    async testProvider(providerName) {
        if (!this.providers[providerName]) {
            return { working: false, error: 'Provider not found' };
        }
        
        try {
            if (providerName === 'ai_horde') {
                const response = await this.generateAIHordeResponse('Hello', '');
                return { working: true, response };
            } else if (providerName === 'mock') {
                const response = this.generateMockResponse('Hello');
                return { working: true, response };
            }
            
            return { working: false, error: 'Provider test not implemented' };
            
        } catch (error) {
            return { working: false, error: error.message };
        }
    }
}

module.exports = MultiProviderAISystem;
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
                name: 'AI Horde API',
                url: 'https://aihorde.net/api/v2/generate/text/async',
                type: 'horde_api',
                working: true,
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

    // AI Horde integration using the specific endpoint and format
    async generateAIHordeResponse(query, context) {
        const endpoint = {
            name: 'AI Horde API',
            url: 'https://aihorde.net/api/v2/generate/text/async',
            type: 'horde_api'
        };

        // Build enhanced prompt with context
        const enhancedPrompt = this.buildAIHordePrompt(query, context);
        
        try {
            console.log(`[AI] Trying ${endpoint.name}...`);
            const response = await this.tryAIHordeEndpoint(endpoint, enhancedPrompt);
            
            if (response && response.length > 10) {
                console.log(`[AI] ✅ Success with ${endpoint.name}`);
                return response;
            }
            
        } catch (error) {
            console.log(`[AI] ❌ ${endpoint.name} failed: ${error.message}`);
            throw error;
        }
        
        throw new Error('AI Horde endpoint failed');
    }

    // Build optimized prompt for AI Horde using the specified format
    buildAIHordePrompt(query, context) {

        return `You are a helpful assistant for the College of Anesthesiologists of Zambia (COAZ). 
        
        Context: ${context.substring(0, 800)}

        Question: ${query}

        Please provide a helpful and accurate response:`;
    }

    // Try AI Horde endpoint with the specified request format
    async tryAIHordeEndpoint(endpoint, prompt) {
        const requestData = {
            "prompt": prompt,
            "params": {
                "n": 1,
                "max_context_length": 3600,
                "max_length": 420,
                "rep_pen": 1.05,
                "temperature": 0.75,
                "top_p": 0.92,
                "top_k": 100,
                "top_a": 0,
                "typical": 1,
                "tfs": 1,
                "rep_pen_range": 360,
                "rep_pen_slope": 0.7,
                "sampler_order": [6, 0, 1, 3, 4, 2, 5],
                "use_default_badwordsids": false,
                "stop_sequence": ["### Instruction:", "### Response:"],
                "min_p": 0,
                "dynatemp_range": 0,
                "dynatemp_exponent": 1,
                "smoothing_factor": 0,
                "nsigma": 0
            },
            "models": [],
            "workers": []
        };

        const headers = { 
            'Content-Type': 'application/json',
            'Client-Agent': 'COAZ-Chatbot:1.0',
            'apikey': '0000000000'  // Anonymous key for AI Horde
        };

        console.log('[AI] Sending request to AI Horde with data:', JSON.stringify(requestData, null, 2));

        const response = await axios.post(endpoint.url, requestData, {
            headers,
            timeout: this.config.timeout
        });

        return await this.parseAIHordeResponse(response, endpoint);
    }

    // Parse AI Horde async API response
    async parseAIHordeResponse(response, endpoint) {
        if (!response.data) {
            throw new Error('No response data');
        }

        // Handle async API response - first response contains task ID
        if (response.data.id) {
            const taskId = response.data.id;
            console.log(`[AI] Got task ID: ${taskId}, waiting for completion...`);
            
            // Poll for completion
            return await this.pollAIHordeResult(taskId);
        }

        // Handle direct response (shouldn't happen with async endpoint)
        let responseText = '';
        if (response.data.generations && response.data.generations[0]) {
            responseText = response.data.generations[0].text;
        } else if (response.data.text) {
            responseText = response.data.text;
        } else if (typeof response.data === 'string') {
            responseText = response.data;
        }

        // Clean up response
        if (responseText && typeof responseText === 'string') {
            // Check for template/placeholder content
            if (responseText.includes('${') || 
                responseText.includes('stash_image_placeholders') ||
                responseText.includes('curr.msg') ||
                responseText.includes('<script>') ||
                responseText.includes('function(')) {
                throw new Error('Response contains template/code content');
            }

            // Clean and validate
            responseText = this.cleanModelResponse(responseText);
            
            if (responseText.length < 10) {
                throw new Error('Response too short');
            }

            return responseText;
        }

        throw new Error('Could not parse response text');
    }

    // Poll AI Horde for result
    async pollAIHordeResult(taskId, maxAttempts = 50) {
        const checkUrl = `https://aihorde.net/api/v2/generate/text/status/${taskId}`;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                
                const statusResponse = await axios.get(checkUrl, {
                    timeout: 10000
                });
                
                if (statusResponse.data.done) {
                    if (statusResponse.data.generations && statusResponse.data.generations.length > 0) {
                        const generatedText = statusResponse.data.generations[0].text;
                        console.log(`[AI] Task completed after ${attempt + 1} attempts`);
                        return this.cleanModelResponse(generatedText);
                    } else {
                        throw new Error('No generations in completed task');
                    }
                } else {
                    console.log(`[AI] Task ${taskId} still processing... (attempt ${attempt + 1}/${maxAttempts})`);
                }
                
            } catch (error) {
                console.warn(`[AI] Polling attempt ${attempt + 1} failed:`, error.message);
                if (attempt === maxAttempts - 1) {
                    throw new Error(`Task polling failed after ${maxAttempts} attempts`);
                }
            }
        }
        
        throw new Error('Task did not complete within timeout period');
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
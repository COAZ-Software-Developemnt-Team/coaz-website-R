const { HfInference } = require('@huggingface/inference');

class SimpleAISystem {
    constructor(config = {}) {
        this.config = {
            aiProvider: config.aiProvider || 'llama3',
            huggingfaceApiKey: config.huggingfaceApiKey || '',
            fallbackToOffline: config.fallbackToOffline !== false,
            models: {
                llama3: {
                    name: config.llama3Model || 'meta-llama/Llama-2-7b-chat-hf',
                    maxTokens: config.llama3MaxTokens || 500,
                    temperature: config.llama3Temperature || 0.7
                },
                'flan-t5': {
                    name: config.flanT5Model || 'google/flan-t5-large',
                    maxTokens: config.flanT5MaxTokens || 512,
                    temperature: config.flanT5Temperature || 0.5
                },
                'gpt-j': {
                    name: config.gptJModel || 'EleutherAI/gpt-j-6b',
                    maxTokens: config.gptJMaxTokens || 500,
                    temperature: config.gptJTemperature || 0.7
                },
                'phi-4': {
                    name: config.phi4Model || 'microsoft/phi-2',
                    maxTokens: config.phi4MaxTokens || 500,
                    temperature: config.phi4Temperature || 0.6
                }
            },
            ...config
        };

        // Initialize Hugging Face Inference
        this.hf = new HfInference(this.config.huggingfaceApiKey);
        
        // Knowledge sources (raw text)
        this.websiteContent = [];
        this.pdfContent = [];
        this.combinedKnowledge = '';

        console.log(`[AI] Simple AI System initialized with provider: ${this.config.aiProvider}`);
        console.log(`[AI] Current model: ${this.config.models[this.config.aiProvider]?.name || 'Unknown'}`);
    }

    // Load website content (raw text array)
    loadWebsiteContent(websiteData) {
        try {
            this.websiteContent = [];
            
            if (websiteData && websiteData.pages && Array.isArray(websiteData.pages)) {
                for (const page of websiteData.pages) {
                    if (page.content && typeof page.content === 'string' && page.content.trim().length > 50) {
                        // Clean and extract meaningful content
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
                // Split PDF into logical sections
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

    // Combine all knowledge sources into single text array
    updateCombinedKnowledge() {
        const allContent = [];
        
        // Add website content
        this.websiteContent.forEach(item => {
            allContent.push(`[WEBSITE: ${item.title}]\n${item.content}`);
        });
        
        // Add PDF content
        this.pdfContent.forEach(item => {
            allContent.push(`[PDF: ${item.section}]\n${item.content}`);
        });
        
        this.combinedKnowledge = allContent.join('\n\n---\n\n');
        console.log(`[AI] Combined knowledge base updated: ${this.combinedKnowledge.length} characters`);
    }

    // Clean and normalize text content
    cleanTextContent(text) {
        return text
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/[^\w\s.,!?;:()\-"']/g, '') // Remove special characters
            .trim();
    }

    // Find relevant content for a query
    findRelevantContent(query, maxChunks = 3) {
        const queryLower = query.toLowerCase();
        const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 2);
        
        // Score all content pieces
        const allPieces = [
            ...this.websiteContent.map(item => ({ ...item, type: 'website' })),
            ...this.pdfContent.map(item => ({ ...item, type: 'pdf' }))
        ];
        
        const scoredPieces = allPieces.map(piece => {
            const contentLower = piece.content.toLowerCase();
            let score = 0;
            
            // Score based on query term matches
            queryTerms.forEach(term => {
                const matches = (contentLower.match(new RegExp(term, 'g')) || []).length;
                score += matches * 2;
            });
            
            // Boost score for exact phrase matches
            if (contentLower.includes(queryLower)) {
                score += 10;
            }
            
            return { ...piece, score };
        });
        
        // Return top scoring pieces
        return scoredPieces
            .sort((a, b) => b.score - a.score)
            .slice(0, maxChunks)
            .filter(piece => piece.score > 0);
    }

    // Generate AI response using selected model
    async generateResponse(query, sessionHistory = []) {
        const startTime = Date.now();
        
        try {
            // Find relevant content
            const relevantContent = this.findRelevantContent(query);
            const contextText = relevantContent
                .map(piece => `${piece.content.substring(0, 500)}...`)
                .join('\n\n');
            
            const currentModel = this.config.models[this.config.aiProvider];
            if (!currentModel) {
                throw new Error(`Model configuration not found for provider: ${this.config.aiProvider}`);
            }

            console.log(`[AI] Generating response using ${this.config.aiProvider} (${currentModel.name})`);
            
            let response;
            
            // Try the selected model
            switch (this.config.aiProvider) {
                case 'llama3':
                    response = await this.generateLlama3Response(query, contextText, sessionHistory);
                    break;
                    
                case 'flan-t5':
                    response = await this.generateFlanT5Response(query, contextText);
                    break;
                    
                case 'gpt-j':
                    response = await this.generateGptJResponse(query, contextText, sessionHistory);
                    break;
                    
                case 'phi-4':
                    response = await this.generatePhi4Response(query, contextText, sessionHistory);
                    break;
                    
                default:
                    throw new Error(`Unsupported AI provider: ${this.config.aiProvider}`);
            }
            
            const processingTime = Date.now() - startTime;
            console.log(`[AI] Response generated in ${processingTime}ms`);
            
            return {
                text: response,
                model: currentModel.name,
                provider: this.config.aiProvider,
                relevantSources: relevantContent.length,
                processingTime
            };
            
        } catch (error) {
            console.error(`[AI] Error with ${this.config.aiProvider}:`, error.message);
            
            if (this.config.fallbackToOffline) {
                console.log('[AI] Falling back to offline response');
                return this.generateOfflineResponse(query);
            }
            
            throw error;
        }
    }

    // Llama3 response generation (using DialoGPT)
    async generateLlama3Response(query, context, history = []) {
        const prompt = this.buildChatPrompt(query, context, history);
        
        try {
            const response = await this.hf.textGeneration({
                model: this.config.models.llama3.name,
                inputs: prompt,
                parameters: {
                    max_new_tokens: this.config.models.llama3.maxTokens,
                    temperature: this.config.models.llama3.temperature,
                    return_full_text: false,
                    do_sample: true,
                    pad_token_id: 50256
                }
            });
            
            return this.cleanModelResponse(response.generated_text);
        } catch (error) {
            console.warn('[AI] DialoGPT failed, trying conversational approach:', error.message);
            
            // Fallback to conversational endpoint for DialoGPT
            try {
                const conversationalResponse = await this.hf.conversational({
                    model: this.config.models.llama3.name,
                    inputs: {
                        text: query,
                        generated_responses: history.filter(h => h.role === 'assistant').map(h => h.content).slice(-3),
                        past_user_inputs: history.filter(h => h.role === 'user').map(h => h.content).slice(-3)
                    }
                });
                
                return this.cleanModelResponse(conversationalResponse.generated_text);
            } catch (convError) {
                throw new Error(`Both text generation and conversational failed: ${error.message}`);
            }
        }
    }

    // Flan-T5 response generation (text-to-text)
    async generateFlanT5Response(query, context) {
        const prompt = `Answer the question based on the context provided.\n\nContext: ${context.substring(0, 1000)}\n\nQuestion: ${query}\n\nAnswer:`;
        
        try {
            const response = await this.hf.textGeneration({
                model: this.config.models['flan-t5'].name,
                inputs: prompt,
                parameters: {
                    max_new_tokens: this.config.models['flan-t5'].maxTokens,
                    temperature: this.config.models['flan-t5'].temperature,
                    return_full_text: false
                }
            });
            
            return this.cleanModelResponse(response.generated_text);
        } catch (error) {
            console.warn('[AI] Flan-T5 text generation failed, trying text2text:', error.message);
            
            // Try text2text generation endpoint
            try {
                const text2textResponse = await this.hf.text2textGeneration({
                    model: this.config.models['flan-t5'].name,
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: this.config.models['flan-t5'].maxTokens,
                        temperature: this.config.models['flan-t5'].temperature
                    }
                });
                
                return this.cleanModelResponse(text2textResponse.generated_text);
            } catch (t2tError) {
                throw new Error(`Both text generation and text2text failed: ${error.message}`);
            }
        }
    }

    // GPT-J response generation
    async generateGptJResponse(query, context, history = []) {
        const prompt = this.buildChatPrompt(query, context, history);
        
        const response = await this.hf.textGeneration({
            model: this.config.models['gpt-j'].name,
            inputs: prompt,
            parameters: {
                max_new_tokens: this.config.models['gpt-j'].maxTokens,
                temperature: this.config.models['gpt-j'].temperature,
                return_full_text: false,
                do_sample: true
            }
        });
        
        return this.cleanModelResponse(response.generated_text);
    }

    // Phi-4 response generation
    async generatePhi4Response(query, context, history = []) {
        const prompt = this.buildChatPrompt(query, context, history);
        
        const response = await this.hf.textGeneration({
            model: this.config.models['phi-4'].name,
            inputs: prompt,
            parameters: {
                max_new_tokens: this.config.models['phi-4'].maxTokens,
                temperature: this.config.models['phi-4'].temperature,
                return_full_text: false,
                do_sample: true
            }
        });
        
        return this.cleanModelResponse(response.generated_text);
    }

    // Build chat prompt with context and history
    buildChatPrompt(query, context, history = []) {
        let prompt = "You are a helpful AI assistant for the College of Anesthesiologists of Zambia (COAZ). ";
        prompt += "Provide accurate, helpful information based on the context provided.\n\n";
        
        if (context && context.trim().length > 0) {
            prompt += `Context Information:\n${context}\n\n`;
        }
        
        // Add recent conversation history
        if (history && history.length > 0) {
            prompt += "Recent conversation:\n";
            history.slice(-4).forEach(msg => {
                if (msg.role === 'user') {
                    prompt += `Human: ${msg.content}\n`;
                } else if (msg.role === 'assistant') {
                    prompt += `Assistant: ${msg.content}\n`;
                }
            });
            prompt += "\n";
        }
        
        prompt += `Human: ${query}\nAssistant:`;
        
        return prompt;
    }

    // Clean and format model response
    cleanModelResponse(text) {
        if (!text) return "I apologize, but I couldn't generate a response. Please try again.";
        
        return text
            .trim()
            .replace(/^(Assistant:|AI:|Response:)\s*/i, '') // Remove prefixes
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    // Offline fallback response
    generateOfflineResponse(query) {
        const queryLower = query.toLowerCase();
        
        // Basic pattern matching for common questions
        if (queryLower.includes('hello') || queryLower.includes('hi')) {
            return {
                text: "Hello! I'm your COAZ AI assistant. I can help you with information about the College of Anesthesiologists of Zambia. What would you like to know?",
                model: 'offline',
                provider: 'offline',
                relevantSources: 0,
                processingTime: 0
            };
        }
        
        if (queryLower.includes('what is coaz') || queryLower.includes('about coaz')) {
            return {
                text: "COAZ stands for the College of Anesthesiologists of Zambia. It's the professional organization for anesthesiologists in Zambia, focused on advancing anesthesiology practice and education.",
                model: 'offline',
                provider: 'offline',
                relevantSources: 0,
                processingTime: 0
            };
        }
        
        // Check if we have relevant content in our knowledge base
        const relevantContent = this.findRelevantContent(query, 1);
        if (relevantContent.length > 0) {
            const content = relevantContent[0].content.substring(0, 500);
            return {
                text: `Based on available information: ${content}...`,
                model: 'offline',
                provider: 'offline',
                relevantSources: relevantContent.length,
                processingTime: 0
            };
        }
        
        return {
            text: "I apologize, but I'm currently unable to process your request. Please try again or contact COAZ directly for assistance.",
            model: 'offline',
            provider: 'offline',
            relevantSources: 0,
            processingTime: 0
        };
    }

    // Get system statistics
    getStats() {
        return {
            provider: this.config.aiProvider,
            currentModel: this.config.models[this.config.aiProvider]?.name || 'Unknown',
            websitePages: this.websiteContent.length,
            pdfSections: this.pdfContent.length,
            totalKnowledgeSize: this.combinedKnowledge.length,
            availableModels: Object.keys(this.config.models)
        };
    }

    // Switch to different model
    switchModel(newProvider) {
        if (this.config.models[newProvider]) {
            this.config.aiProvider = newProvider;
            console.log(`[AI] Switched to ${newProvider} model: ${this.config.models[newProvider].name}`);
            return true;
        }
        return false;
    }
}

module.exports = SimpleAISystem;
// Improved Chat Endpoint Implementation
// This file shows how to integrate the enhanced RAG system and query processor

const ImprovedRAGSystem = require('./improved-rag-system');
const EnhancedQueryProcessor = require('./enhanced-query-processor');

class ImprovedChatEndpoint {
    constructor(config, hf, fuse, constitutionSections, sessionManager, logger, websiteCache = null) {
        this.config = config;
        this.hf = hf;
        this.fuse = fuse;
        this.constitutionSections = constitutionSections;
        this.sessionManager = sessionManager;
        this.logger = logger;
        this.websiteCache = websiteCache;
        
        // Initialize improved components
        this.ragSystem = new ImprovedRAGSystem({
            qaModel: config.huggingface.qaModel,
            huggingfaceApiKey: config.huggingface.apiKey,
            maxRetrievedChunks: 2, // Reduced for better precision
            retrievalThreshold: 0.2, // Stricter threshold
            maxContextLength: 800, // Shorter context for better focus
            confidenceThreshold: 0.4, // Higher confidence requirement
            maxResponseLength: 200 // Limit response length
        });
        
        this.queryProcessor = new EnhancedQueryProcessor();
        
        // Index documents in improved RAG system - include website data
        this.initializeRAGSystem();
        
        console.log('[IMPROVED-CHAT] Enhanced chat endpoint initialized');
    }

    initializeRAGSystem() {
        if (this.constitutionSections && this.constitutionSections.length > 0) {
            const websiteData = this.websiteCache?.data || null;
            this.ragSystem.indexDocuments(this.constitutionSections, websiteData);
        } else {
            console.warn('[IMPROVED-CHAT] No constitution sections available for indexing');
        }
    }

    // Method to update website data when it's refreshed
    updateWebsiteData(websiteData) {
        this.websiteCache = { data: websiteData };
        this.initializeRAGSystem(); // Re-index with new website data
        console.log('[IMPROVED-CHAT] Updated website data and re-indexed RAG system');
    }

    async processMessage(req, res) {
        const startTime = Date.now();
        
        try {
            const { query, sessionId = 'default', useRag = true } = req.body;
            
            if (!query || typeof query !== 'string' || query.trim().length === 0) {
                return res.status(400).json({
                    error: 'Query is required and must be a non-empty string'
                });
            }

            const cleanQuery = query.trim();
            this.logger.info(`[IMPROVED-CHAT] Processing query: "${cleanQuery}"`, { sessionId, useRag });

            // Step 1: Analyze the query
            const queryAnalysis = this.queryProcessor.analyzeQuery(cleanQuery);
            console.log(`[IMPROVED-CHAT] Query analysis:`, queryAnalysis);

            let finalResult = null;

            // Step 2: Try RAG system if enabled and query needs context
            if (useRag && this.ragSystem.isInitialized && (queryAnalysis.needsContext || queryAnalysis.type === 'detailed')) {
                console.log('[IMPROVED-CHAT] Using improved RAG system...');
                
                const ragResult = await this.ragSystem.processQuery(cleanQuery);
                console.log(`[IMPROVED-CHAT] RAG result: confidence=${ragResult.confidence}, type=${ragResult.responseType}`);
                
                // Only use RAG result if it's high quality
                if (ragResult.confidence > 0.4 && ragResult.hasRelevantContext) {
                    finalResult = {
                        answer: ragResult.answer,
                        confidence: ragResult.confidence,
                        responseType: 'rag_enhanced',
                        processingTime: ragResult.processingTimeMs,
                        ragMetadata: {
                            model: ragResult.model,
                            confidence: ragResult.confidence,
                            contextChunks: ragResult.metadata?.chunkCount || 0,
                            processingTime: ragResult.processingTimeMs,
                            queryIntent: ragResult.metadata?.queryIntent
                        }
                    };
                }
            }

            // Step 3: Use query processor for final processing
            if (!finalResult) {
                console.log('[IMPROVED-CHAT] Using query processor fallback...');
                const processedResult = this.queryProcessor.processQuery(cleanQuery, null, null);
                
                finalResult = {
                    answer: processedResult.answer,
                    confidence: processedResult.confidence,
                    responseType: processedResult.responseType,
                    source: processedResult.source
                };
            } else {
                // Still process through query processor for formatting
                const processedResult = this.queryProcessor.processQuery(
                    cleanQuery, 
                    { answer: finalResult.answer, confidence: finalResult.confidence }, 
                    null
                );
                
                if (processedResult.answer !== finalResult.answer) {
                    finalResult.answer = processedResult.answer;
                    finalResult.responseType = 'rag_processed';
                }
            }

            // Step 4: Update session history
            this.sessionManager.updateSessionHistory(sessionId, cleanQuery, finalResult.answer);

            // Step 5: Log and return result
            const totalTime = Date.now() - startTime;
            this.logger.info(`[IMPROVED-CHAT] Response generated in ${totalTime}ms`, {
                sessionId,
                responseType: finalResult.responseType,
                confidence: finalResult.confidence,
                answerLength: finalResult.answer?.length || 0
            });

            res.json({
                text: finalResult.answer,
                answer: finalResult.answer, // For backward compatibility
                responseType: finalResult.responseType,
                confidence: finalResult.confidence,
                processingTime: totalTime,
                ragMetadata: finalResult.ragMetadata,
                sessionId: sessionId,
                queryAnalysis: {
                    type: queryAnalysis.type,
                    needsShortAnswer: queryAnalysis.needsShortAnswer
                }
            });

        } catch (error) {
            const totalTime = Date.now() - startTime;
            this.logger.error('[IMPROVED-CHAT] Error processing message:', error);

            res.status(500).json({
                error: 'Internal server error',
                message: 'I encountered an error while processing your question. Please try again.',
                processingTime: totalTime
            });
        }
    }

    // Method to get system stats
    getStats() {
        return {
            ragSystem: this.ragSystem.getStats(),
            sessionManager: this.sessionManager.getStats(),
            timestamp: new Date().toISOString()
        };
    }
}

// Function to integrate with existing server.js
function createImprovedChatHandler(config, hf, fuse, constitutionSections, sessionManager, logger, websiteCache = null) {
    const improvedChat = new ImprovedChatEndpoint(
        config, hf, fuse, constitutionSections, sessionManager, logger, websiteCache
    );
    
    return {
        handler: async (req, res) => {
            await improvedChat.processMessage(req, res);
        },
        updateWebsiteData: (websiteData) => {
            improvedChat.updateWebsiteData(websiteData);
        }
    };
}

module.exports = { ImprovedChatEndpoint, createImprovedChatHandler };
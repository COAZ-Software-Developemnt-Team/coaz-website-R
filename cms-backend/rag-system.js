const { HfInference } = require('@huggingface/inference');
const Fuse = require('fuse.js');

class RAGSystem {
    constructor(config = {}) {
        this.config = {
            qaModel: config.qaModel || 'deepset/roberta-base-squad2',
            fallbackQaModel: config.fallbackQaModel || 'microsoft/DialoGPT-medium',
            huggingfaceApiKey: config.huggingfaceApiKey || '',
            maxRetrievedChunks: config.maxRetrievedChunks || 3,
            retrievalThreshold: config.retrievalThreshold || 0.3,
            maxContextLength: config.maxContextLength || 2000,
            confidenceThreshold: config.confidenceThreshold || 0.1,
            ...config
        };

        // Initialize Hugging Face
        this.hf = new HfInference(this.config.huggingfaceApiKey);

        this.documents = [];
        this.fuse = null;
        this.isInitialized = false;

        console.log(`[RAG] System initialized with QA model: ${this.config.qaModel}`);
    }

    indexDocuments(documents) {
        if (!documents || documents.length === 0) {
            console.error('[RAG] No documents provided for indexing');
            return;
        }

        this.documents = documents;

        // Initialize Fuse.js for semantic search
        this.fuse = new Fuse(this.documents, {
            includeScore: true,
            threshold: this.config.retrievalThreshold,
            ignoreLocation: true,
            minMatchCharLength: 2,
            keys: [{
                name: 'text',
                weight: 1
            }]
        });

        this.isInitialized = true;
        console.log(`[RAG] Indexed ${this.documents.length} document chunks`);
    }

    async retrieveRelevantChunks(query, limit = null) {
        if (!this.isInitialized || !this.fuse) {
            console.error('[RAG] System not initialized');
            return [];
        }

        const maxChunks = limit || this.config.maxRetrievedChunks;
        const results = this.fuse.search(query, { limit: maxChunks });

        return results
            .filter(result => result.score <= this.config.retrievalThreshold)
            .map(result => ({
                text: result.item,
                score: result.score
            }));
    }

    async queryQAModel(question, context) {
        if (!context || context.trim().length < 50) {
            return {
                answer: "I couldn't find enough relevant information in the constitution to answer this question.",
                confidence: 0,
                hasRelevantContext: false
            };
        }

        // Truncate context to avoid token limits
        const truncatedContext = context.length > this.config.maxContextLength
            ? context.substring(0, this.config.maxContextLength) + '...'
            : context;

        try {
            console.log(`[RAG] Querying QA model: ${this.config.qaModel}`);

            const result = await this.hf.questionAnswering({
                model: this.config.qaModel,
                inputs: {
                    question: question,
                    context: truncatedContext
                }
            });

            const confidence = result.score || 0.5; // Default confidence if not provided

            return {
                answer: result.answer,
                confidence: confidence,
                hasRelevantContext: true,
                model: this.config.qaModel,
                contextChunks: Math.ceil(truncatedContext.length / 500) // Estimate chunks
            };

        } catch (error) {
            console.error(`[RAG] QA model error: ${error.message}`);

            // Fallback to simple context extraction
            return this.fallbackAnswer(question, truncatedContext);
        }
    }

    fallbackAnswer(question, context) {
        // Simple keyword-based answer extraction as fallback
        const questionWords = question.toLowerCase().split(/\s+/).filter(word => word.length > 3);

        // Find sentences in context that contain question keywords
        const sentences = context.split(/[.!?]+/);
        const relevantSentences = sentences.filter(sentence => {
            const sentenceLower = sentence.toLowerCase();
            return questionWords.some(word => sentenceLower.includes(word));
        });

        if (relevantSentences.length > 0) {
            return {
                answer: relevantSentences.slice(0, 2).join('. ') + '.',
                confidence: 0.3,
                hasRelevantContext: true,
                model: 'keyword_fallback',
                contextChunks: 1,
                metadata: {
                    isExtraction: true,
                    isFallback: true
                }
            };
        }

        // Return generic answer if no relevant sentences found
        return {
            answer: "Based on the constitution document, I found relevant information but couldn't extract a specific answer. Here's the relevant context:\n\n" +
                context.substring(0, 300) + "...",
            confidence: 0.1,
            hasRelevantContext: true,
            model: 'context_fallback',
            contextChunks: 1,
            metadata: {
                isExtraction: false,
                isFallback: true
            }
        };
    }

    async processQuery(query) {
        const startTime = Date.now();

        try {
            if (!this.isInitialized) {
                throw new Error('RAG system not initialized');
            }

            // 1. Retrieve relevant document chunks
            const relevantChunks = await this.retrieveRelevantChunks(query);

            if (relevantChunks.length === 0) {
                return {
                    answer: "I couldn't find any relevant information in the constitution to answer your question.",
                    confidence: 0,
                    hasRelevantContext: false,
                    model: 'none',
                    contextChunks: 0,
                    processingTimeMs: Date.now() - startTime,
                    metadata: {
                        retrievedContext: null
                    }
                };
            }

            // 2. Combine chunks into context
            const context = relevantChunks.map(chunk => chunk.text).join('\n\n');

            // 3. Query QA model with context
            const qaResult = await this.queryQAModel(query, context);

            return {
                ...qaResult,
                processingTimeMs: Date.now() - startTime,
                metadata: {
                    retrievedContext: context.substring(0, 500) + (context.length > 500 ? '...' : ''),
                    chunkCount: relevantChunks.length,
                    averageRelevanceScore: relevantChunks.reduce((sum, chunk) => sum + chunk.score, 0) / relevantChunks.length
                }
            };

        } catch (error) {
            console.error(`[RAG] Processing error: ${error.message}`);

            return {
                answer: "I encountered an error while processing your question with the constitution database.",
                confidence: 0,
                hasRelevantContext: false,
                model: 'error',
                contextChunks: 0,
                processingTimeMs: Date.now() - startTime,
                metadata: {
                    error: error.message
                }
            };
        }
    }

    getStats() {
        return {
            isInitialized: this.isInitialized,
            documentCount: this.documents.length,
            config: this.config
        };
    }
}

module.exports = RAGSystem;
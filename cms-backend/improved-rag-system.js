const { HfInference } = require('@huggingface/inference');
const Fuse = require('fuse.js');

class ImprovedRAGSystem {
    constructor(config = {}) {
        this.config = {
            qaModel: config.qaModel || 'deepset/roberta-base-squad2',
            huggingfaceApiKey: config.huggingfaceApiKey || '',
            maxRetrievedChunks: config.maxRetrievedChunks || 3,
            retrievalThreshold: config.retrievalThreshold || 0.2, // Stricter threshold
            maxContextLength: config.maxContextLength || 1000, // Reduced context
            confidenceThreshold: config.confidenceThreshold || 0.3, // Higher confidence needed
            maxResponseLength: config.maxResponseLength || 200, // Limit response length
            ...config
        };

        this.hf = new HfInference(this.config.huggingfaceApiKey);
        this.documents = [];
        this.fuse = null;
        this.isInitialized = false;

        console.log(`[IMPROVED-RAG] System initialized with stricter filtering`);
    }

    indexDocuments(documents, websiteData = null) {
        if (!documents || documents.length === 0) {
            console.error('[IMPROVED-RAG] No documents provided for indexing');
            return;
        }

        // Combine constitution documents with website content
        this.documents = [...documents];
        
        // Add website content if available
        if (websiteData && websiteData.pages && Array.isArray(websiteData.pages)) {
            console.log(`[IMPROVED-RAG] Adding ${websiteData.pages.length} website pages to index`);
            
            for (const page of websiteData.pages) {
                console.log(`[IMPROVED-RAG] Processing page: ${page.url}, content type: ${typeof page.content}`);
                if (page.content) {
                    // Convert content to string if it's not already
                    let contentStr = '';
                    if (typeof page.content === 'string') {
                        contentStr = page.content;
                    } else if (Array.isArray(page.content)) {
                        contentStr = page.content.join(' ');
                    } else if (typeof page.content === 'object') {
                        contentStr = JSON.stringify(page.content);
                    } else {
                        contentStr = String(page.content);
                    }
                    
                    if (contentStr.length > 50) {
                        // Clean and chunk website content
                        const cleanContent = this.cleanWebContent(contentStr);
                        if (cleanContent.length > 100) {
                            // Add metadata to distinguish web content from constitution
                            this.documents.push({
                                text: cleanContent,
                                source: 'website',
                                url: page.url,
                                title: page.title || 'COAZ Website'
                            });
                        }
                    }
                }
            }
        }

        // Ensure all document fields are strings before indexing
        const cleanDocuments = this.documents.map(doc => ({
            text: String(doc.text || ''),
            title: String(doc.title || ''),
            source: String(doc.source || ''),
            url: String(doc.url || '')
        })).filter(doc => doc.text.trim().length > 0);

        // Create searchable index with improved configuration
        this.fuse = new Fuse(cleanDocuments, {
            includeScore: true,
            threshold: this.config.retrievalThreshold,
            ignoreLocation: true,
            minMatchCharLength: 3,
            keys: [
                { name: 'text', weight: 1 },
                { name: 'title', weight: 0.8 },
                { name: 'source', weight: 0.3 }
            ]
        });

        this.isInitialized = true;
        console.log(`[IMPROVED-RAG] Indexed ${cleanDocuments.length} total chunks (constitution + website)`);
    }

    // Clean website content to remove noise
    cleanWebContent(content) {
        if (!content || typeof content !== 'string') return '';
        
        try {
            // Remove common web noise patterns
            let cleaned = content
                .replace(/\b(home|login|register|menu|navigation|footer|header)\b/gi, '')
                .replace(/countdown\s*\d+/gi, '')
                .replace(/\d+\s+(days?|hours?|minutes?|seconds?)/gi, '')
                .replace(/click here/gi, '')
                .replace(/read more/gi, '')
                .replace(/join us/gi, '')
                .replace(/welcome to/gi, '')
                .replace(/\s+/g, ' ')
                .trim();
                
            return cleaned;
        } catch (error) {
            console.error('[IMPROVED-RAG] Error cleaning web content:', error.message);
            return '';
        }
    }

    // Enhanced query intent detection
    detectQueryIntent(query) {
        const queryLower = query.toLowerCase().trim();
        
        // Simple factual questions that need direct answers
        const simplePatterns = [
            /what\s+(is|does)\s+coaz(\s+(stand\s+for|mean))?/,
            /what\s+is\s+(the\s+)?full\s+form\s+of\s+coaz/,
            /coaz\s+stands?\s+for/,
            /where\s+is\s+coaz/,
            /what\s+country\s+is\s+coaz\s+in/,
            /is\s+coaz\s+in\s+zambia/,
            /does\s+coaz\s+exist/
        ];

        // Complex questions that need detailed responses
        const complexPatterns = [
            /how\s+to\s+join/,
            /membership\s+requirements/,
            /training\s+programs?/,
            /education/,
            /objectives?/,
            /mission/,
            /committee/,
            /governance/
        ];

        const isSimple = simplePatterns.some(pattern => pattern.test(queryLower));
        const isComplex = complexPatterns.some(pattern => pattern.test(queryLower));

        return {
            type: isSimple ? 'simple' : isComplex ? 'complex' : 'general',
            needsShortAnswer: isSimple,
            needsDetailedAnswer: isComplex
        };
    }

    // Smart context filtering
    filterRelevantContext(query, chunks) {
        const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const filteredChunks = [];

        for (const chunk of chunks) {
            const chunkText = chunk.text.toLowerCase();
            let relevanceScore = 0;
            let matchedWords = 0;

            // Count how many query words appear in this chunk
            for (const word of queryWords) {
                if (chunkText.includes(word)) {
                    matchedWords++;
                    relevanceScore += 2;
                }
            }

            // Require at least 30% of query words to be present
            const wordMatchRatio = matchedWords / queryWords.length;
            if (wordMatchRatio >= 0.3) {
                filteredChunks.push({
                    ...chunk,
                    relevanceScore,
                    wordMatchRatio
                });
            }
        }

        // Sort by relevance and return top chunks
        return filteredChunks
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 2); // Limit to 2 most relevant chunks
    }

    async retrieveRelevantChunks(query, limit = null) {
        if (!this.isInitialized || !this.fuse) {
            console.error('[IMPROVED-RAG] System not initialized');
            return [];
        }

        const maxChunks = limit || this.config.maxRetrievedChunks;
        const results = this.fuse.search(query, { limit: maxChunks * 2 }); // Get more results to filter

        const relevantChunks = results
            .filter(result => result.score <= this.config.retrievalThreshold)
            .map(result => ({
                text: result.item,
                score: result.score
            }));

        // Apply smart filtering
        return this.filterRelevantContext(query, relevantChunks);
    }

    // Generate concise answers for simple questions
    generateSimpleAnswer(query, context) {
        const queryLower = query.toLowerCase();
        
        // Handle "what is COAZ" type questions
        if (queryLower.includes('what') && queryLower.includes('coaz') && !queryLower.includes('stand for')) {
            return "COAZ is the College of Anesthesiologists of Zambia, a professional organization for anesthesiology specialists in Zambia.";
        }

        // Handle "what does COAZ stand for" questions
        if (queryLower.includes('stand') || queryLower.includes('full form') || queryLower.includes('mean')) {
            return "COAZ stands for College of Anesthesiologists of Zambia.";
        }

        // Handle location questions
        if (queryLower.includes('where') || queryLower.includes('country') || queryLower.includes('located')) {
            return "COAZ is located in Zambia, serving anesthesiology professionals throughout the country.";
        }

        // Handle existence questions
        if (queryLower.includes('exist') || queryLower.includes('real')) {
            return "Yes, COAZ exists as the official College of Anesthesiologists of Zambia.";
        }

        // Extract short relevant snippet from context if available
        if (context && context.length > 50) {
            const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 20);
            const firstRelevantSentence = sentences[0]?.trim();
            if (firstRelevantSentence && firstRelevantSentence.length < 150) {
                return firstRelevantSentence + ".";
            }
        }

        return null; // Let the main system handle it
    }

    async queryQAModel(question, context) {
        if (!context || context.trim().length < 30) {
            return {
                answer: "I couldn't find specific information about this in the available documents.",
                confidence: 0,
                hasRelevantContext: false
            };
        }

        // Truncate context more aggressively for better precision
        const truncatedContext = context.length > this.config.maxContextLength
            ? context.substring(0, this.config.maxContextLength)
            : context;

        try {
            console.log(`[IMPROVED-RAG] Querying QA model with ${truncatedContext.length} chars of context`);

            const result = await this.hf.questionAnswering({
                model: this.config.qaModel,
                inputs: {
                    question: question,
                    context: truncatedContext
                }
            });

            const confidence = result.score || 0.5;

            // Only accept high-confidence answers
            if (confidence < this.config.confidenceThreshold) {
                console.log(`[IMPROVED-RAG] Low confidence answer rejected: ${confidence}`);
                return {
                    answer: "I found some relevant information but I'm not confident enough to provide a definitive answer.",
                    confidence: confidence,
                    hasRelevantContext: true,
                    wasRejected: true
                };
            }

            // Limit response length for conciseness
            let answer = result.answer;
            if (answer.length > this.config.maxResponseLength) {
                // Find a good cutoff point (end of sentence)
                const cutoff = answer.lastIndexOf('.', this.config.maxResponseLength);
                if (cutoff > this.config.maxResponseLength * 0.7) {
                    answer = answer.substring(0, cutoff + 1);
                } else {
                    answer = answer.substring(0, this.config.maxResponseLength) + "...";
                }
            }

            return {
                answer: answer,
                confidence: confidence,
                hasRelevantContext: true,
                model: this.config.qaModel
            };

        } catch (error) {
            console.error(`[IMPROVED-RAG] QA model error: ${error.message}`);
            return {
                answer: "I encountered an error while processing this question.",
                confidence: 0,
                hasRelevantContext: false,
                error: error.message
            };
        }
    }

    async processQuery(query) {
        const startTime = Date.now();

        try {
            if (!this.isInitialized) {
                throw new Error('RAG system not initialized');
            }

            // Detect query intent
            const intent = this.detectQueryIntent(query);
            console.log(`[IMPROVED-RAG] Query intent: ${intent.type}, needsShortAnswer: ${intent.needsShortAnswer}`);

            // For simple questions, try to answer directly first
            if (intent.needsShortAnswer) {
                const simpleAnswer = this.generateSimpleAnswer(query, null);
                if (simpleAnswer) {
                    return {
                        answer: simpleAnswer,
                        confidence: 0.9,
                        hasRelevantContext: true,
                        model: 'rule_based',
                        responseType: 'simple_direct',
                        processingTimeMs: Date.now() - startTime
                    };
                }
            }

            // Retrieve relevant document chunks
            const relevantChunks = await this.retrieveRelevantChunks(query);

            if (relevantChunks.length === 0) {
                return {
                    answer: intent.needsShortAnswer 
                        ? "I don't have specific information about that." 
                        : "I couldn't find relevant information in the available documents to answer your question.",
                    confidence: 0,
                    hasRelevantContext: false,
                    model: 'none',
                    responseType: 'no_context',
                    processingTimeMs: Date.now() - startTime
                };
            }

            // Combine chunks into context (limited)
            const context = relevantChunks
                .slice(0, 2) // Limit to 2 best chunks
                .map(chunk => chunk.text)
                .join('\n\n');

            console.log(`[IMPROVED-RAG] Using ${relevantChunks.length} chunks, ${context.length} chars total`);

            // For simple questions with context, try simple extraction first
            if (intent.needsShortAnswer) {
                const simpleAnswer = this.generateSimpleAnswer(query, context);
                if (simpleAnswer) {
                    return {
                        answer: simpleAnswer,
                        confidence: 0.8,
                        hasRelevantContext: true,
                        model: 'context_extraction',
                        responseType: 'simple_extracted',
                        processingTimeMs: Date.now() - startTime
                    };
                }
            }

            // Query QA model with context
            const qaResult = await this.queryQAModel(query, context);

            return {
                ...qaResult,
                responseType: intent.needsShortAnswer ? 'simple_qa' : 'detailed_qa',
                processingTimeMs: Date.now() - startTime,
                metadata: {
                    chunkCount: relevantChunks.length,
                    averageRelevanceScore: relevantChunks.reduce((sum, chunk) => sum + chunk.relevanceScore, 0) / relevantChunks.length,
                    queryIntent: intent.type
                }
            };

        } catch (error) {
            console.error(`[IMPROVED-RAG] Processing error: ${error.message}`);
            return {
                answer: "I encountered an error while processing your question.",
                confidence: 0,
                hasRelevantContext: false,
                model: 'error',
                responseType: 'error',
                processingTimeMs: Date.now() - startTime,
                metadata: { error: error.message }
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

module.exports = ImprovedRAGSystem;
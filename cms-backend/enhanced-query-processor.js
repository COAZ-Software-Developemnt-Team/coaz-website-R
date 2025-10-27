// Enhanced Query Processor for COAZ Chatbot
// Improves response accuracy and conciseness

class EnhancedQueryProcessor {
    constructor() {
        // Common COAZ-related terms and abbreviations
        this.coazTerms = {
            'coaz': 'College of Anesthesiologists of Zambia',
            'anesthesia': 'anesthesiology',
            'anaesthesia': 'anesthesiology',
            'cpd': 'Continuing Professional Development',
            'agm': 'Annual General Meeting'
        };

        // Simple question patterns that need direct answers
        this.simplePatterns = [
            { pattern: /what\s+(is|does)\s+coaz(\s+(stand\s+for|mean))?/i, type: 'definition' },
            { pattern: /coaz\s+(stands?\s+for|means?)/i, type: 'abbreviation' },
            { pattern: /where\s+is\s+coaz/i, type: 'location' },
            { pattern: /what\s+country/i, type: 'location' },
            { pattern: /is\s+coaz\s+in\s+zambia/i, type: 'location_confirm' },
            { pattern: /does\s+coaz\s+exist/i, type: 'existence' },
            { pattern: /full\s+form\s+of\s+coaz/i, type: 'abbreviation' }
        ];

        // Patterns that indicate the user wants detailed information
        this.detailedPatterns = [
            /how\s+(do\s+i\s+)?(to\s+)?(join|become|apply)/i,
            /how\s+can\s+i\s+(join|become|apply)/i,
            /membership\s+(requirements|process|benefits|application)/i,
            /become\s+a?\s+member/i,
            /join\s+(coaz|the\s+college)/i,
            /training\s+programs?/i,
            /education\s+programs?/i,
            /(objectives?|goals?|mission)/i,
            /(committee|governance|leadership)/i,
            /constitution/i,
            /where\s+(are\s+)?(your\s+)?offices?/i,
            /office\s+location/i,
            /contact\s+(details|information)/i
        ];
    }

    // Analyze the query to determine response type needed
    analyzeQuery(query) {
        const cleanQuery = query.trim().toLowerCase();
        
        // Check for simple patterns first
        for (const { pattern, type } of this.simplePatterns) {
            if (pattern.test(cleanQuery)) {
                return {
                    type: 'simple',
                    subtype: type,
                    needsShortAnswer: true,
                    needsContext: false,
                    maxLength: 100
                };
            }
        }

        // Check for detailed patterns
        const needsDetailed = this.detailedPatterns.some(pattern => pattern.test(cleanQuery));
        if (needsDetailed) {
            return {
                type: 'detailed',
                needsShortAnswer: false,
                needsContext: true,
                maxLength: 300
            };
        }

        // Check if it's COAZ-related at all
        const isCoazRelated = this.isCoazRelated(cleanQuery);
        
        return {
            type: isCoazRelated ? 'general_coaz' : 'general',
            needsShortAnswer: cleanQuery.length < 50,
            needsContext: isCoazRelated || needsDetailed, // Always check context for detailed questions
            maxLength: isCoazRelated ? 200 : 150
        };
    }

    // Check if query is related to COAZ
    isCoazRelated(query) {
        const coazKeywords = [
            'coaz', 'college', 'anesthesiologists', 'anaesthesiologists', 
            'zambia', 'anesthesia', 'anaesthesia', 'medical', 'doctor',
            'membership', 'training', 'cpd', 'constitution', 'member',
            'join', 'become', 'office', 'contact', 'location', 'requirements',
            'benefits', 'education', 'professional', 'development'
        ];
        
        return coazKeywords.some(keyword => query.includes(keyword));
    }

    // Generate direct answers for simple questions
    generateDirectAnswer(query, analysis) {
        const queryLower = query.toLowerCase();

        switch (analysis.subtype) {
            case 'definition':
                return "COAZ is the College of Anesthesiologists of Zambia, a professional organization for anesthesiology specialists in Zambia.";
            
            case 'abbreviation':
                return "COAZ stands for College of Anesthesiologists of Zambia.";
            
            case 'location':
                return "COAZ is located in Zambia.";
            
            case 'location_confirm':
                return "Yes, COAZ is in Zambia. It serves anesthesiology professionals throughout the country.";
            
            case 'existence':
                return "Yes, COAZ exists as the official College of Anesthesiologists of Zambia.";
            
            default:
                return null;
        }
    }

    // Clean and format response text
    formatResponse(text, analysis) {
        if (!text) return text;

        // Remove excessive markup and HTML
        let cleaned = text.replace(/<[^>]*>/g, '').trim();
        
        // Remove redundant prefixes
        cleaned = cleaned.replace(/^\[CONSTITUTION\]\s*/i, '');
        cleaned = cleaned.replace(/^\[.*?\]\s*/i, '');
        
        // Limit length based on analysis
        if (cleaned.length > analysis.maxLength) {
            // Find a good cutoff point
            const sentences = cleaned.split(/[.!?]+/);
            let result = '';
            
            for (const sentence of sentences) {
                const newLength = result.length + sentence.length + 1;
                if (newLength > analysis.maxLength) break;
                result += (result ? '. ' : '') + sentence.trim();
            }
            
            if (result.length > 0) {
                cleaned = result + '.';
            } else {
                // Fallback: hard cut with ellipsis
                cleaned = cleaned.substring(0, analysis.maxLength - 3) + '...';
            }
        }

        // Ensure it ends properly
        if (cleaned && !cleaned.match(/[.!?]$/)) {
            cleaned += '.';
        }

        return cleaned;
    }

    // Check if a response is relevant to the query
    isResponseRelevant(query, response, threshold = 0.3) {
        if (!response || response.length < 10) return false;

        const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const responseWords = response.toLowerCase().split(/\s+/);
        
        let matchCount = 0;
        for (const qWord of queryWords) {
            if (responseWords.some(rWord => rWord.includes(qWord) || qWord.includes(rWord))) {
                matchCount++;
            }
        }

        const relevanceScore = matchCount / queryWords.length;
        return relevanceScore >= threshold;
    }

    // Filter out irrelevant web content
    filterWebContent(content, query) {
        if (!content) return null;

        // Remove common web noise
        const noisePatterns = [
            /countdown/gi,
            /\b(home|login|register|menu|navigation)\b/gi,
            /click here/gi,
            /read more/gi,
            /join us/gi,
            /welcome to/gi,
            /\d+\s+(days?|hours?|minutes?|seconds?)/gi
        ];

        let cleaned = content;
        for (const pattern of noisePatterns) {
            cleaned = cleaned.replace(pattern, '');
        }

        // Check if remaining content is relevant
        if (!this.isResponseRelevant(query, cleaned)) {
            return null;
        }

        return cleaned.trim();
    }

    // Main processing function
    processQuery(query, ragResult, webContent = null) {
        const analysis = this.analyzeQuery(query);
        
        console.log(`[QUERY-PROCESSOR] Query type: ${analysis.type}, needs short answer: ${analysis.needsShortAnswer}`);

        // For simple questions, try direct answers first
        if (analysis.needsShortAnswer) {
            const directAnswer = this.generateDirectAnswer(query, analysis);
            if (directAnswer) {
                return {
                    answer: directAnswer,
                    responseType: 'direct_answer',
                    confidence: 0.95,
                    source: 'rule_based'
                };
            }
        }

        // Process RAG result if available
        if (ragResult && ragResult.answer && ragResult.confidence > 0.3) {
            const formattedRAG = this.formatResponse(ragResult.answer, analysis);
            
            // Check relevance
            if (this.isResponseRelevant(query, formattedRAG)) {
                return {
                    answer: formattedRAG,
                    responseType: 'rag_processed',
                    confidence: ragResult.confidence,
                    source: 'constitution'
                };
            }
        }

        // Process web content as fallback
        if (webContent && analysis.needsContext) {
            const filteredWeb = this.filterWebContent(webContent, query);
            if (filteredWeb) {
                const formattedWeb = this.formatResponse(filteredWeb, analysis);
                return {
                    answer: formattedWeb,
                    responseType: 'web_processed',
                    confidence: 0.6,
                    source: 'website'
                };
            }
        }

        // Generate contextual fallback based on query type
        return this.generateFallbackResponse(query, analysis);
    }

    generateFallbackResponse(query, analysis) {
        if (!this.isCoazRelated(query)) {
            return {
                answer: `I specialize in information about COAZ (College of Anesthesiologists of Zambia). Could you ask me something about COAZ membership, training, or organizational details?`,
                responseType: 'redirect',
                confidence: 0.7,
                source: 'fallback'
            };
        }

        if (analysis.needsShortAnswer) {
            return {
                answer: "I don't have specific information about that aspect of COAZ. Try asking about membership, training programs, or organizational structure.",
                responseType: 'no_info_short',
                confidence: 0.5,
                source: 'fallback'
            };
        }

        return {
            answer: `I'd like to help with your question about COAZ, but I don't have specific information on that topic. I can assist with questions about COAZ membership, training programs, organizational objectives, and governance structure.`,
            responseType: 'no_info_detailed',
            confidence: 0.5,
            source: 'fallback'
        };
    }
}

module.exports = EnhancedQueryProcessor;
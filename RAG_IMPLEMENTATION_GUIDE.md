# RAG System Implementation Guide

## Overview

Your COAZ application now implements a comprehensive **Retrieval-Augmented Generation (RAG)** system that combines your existing fuzzy search with specialized Hugging Face QA models for enhanced document-based question answering.

## 🏗️ Architecture

### Two-Model Approach
1. **Retrieval Component**: Enhanced Fuse.js fuzzy search for document context extraction
2. **Generation Component**: Hugging Face QA models for intelligent answer generation

### Key Components

#### Backend (`cms-backend/`)
- `rag-system.js` - Core RAG implementation
- `server.js` - Enhanced with RAG endpoints and integration
- Environment configuration for QA models

#### Frontend (`src/components/`)
- `ChatBot.js` - Updated with RAG controls and metadata display

## 🚀 Features Implemented

### 1. Intelligent Document Retrieval
- **Smart Chunking**: Documents split into searchable sections
- **Semantic Search**: Fuse.js with optimized scoring
- **Context Ranking**: Confidence-based chunk selection
- **Fallback Mechanisms**: Multiple retrieval strategies

### 2. Specialized QA Models
- **Primary Model**: `deepset/roberta-base-squad2` (RoBERTa-based QA)
- **Fallback Model**: `microsoft/DialoGPT-medium` (Generative)
- **Extraction Fallback**: Sentence-level extraction when models fail

### 3. Enhanced User Interface
- **Mode Toggle**: Switch between RAG and traditional search
- **Real-time Indicators**: Visual feedback for response types
- **Metadata Display**: Confidence scores, processing times, model info
- **Settings Panel**: User controls for response modes

### 4. Robust Error Handling
- **Graceful Degradation**: Falls back through multiple models
- **Offline Mode**: Continues with search-only when AI fails
- **Retry Logic**: Attempts multiple Hugging Face models
- **User Feedback**: Clear error messages and status indicators

## 🔧 Configuration

### Environment Variables (.env)

```bash
# RAG System Configuration
HUGGINGFACE_API_KEY=your-hf-token-here  # Optional but recommended
HUGGINGFACE_QA_MODEL=deepset/roberta-base-squad2
HUGGINGFACE_FALLBACK_QA_MODEL=microsoft/DialoGPT-medium

# Original configuration maintained
AI_PROVIDER=huggingface
AI_FALLBACK_OFFLINE=true
```

### QA Model Options

**Recommended Models:**
- `deepset/roberta-base-squad2` - High accuracy, optimized for Q&A
- `distilbert-base-cased-distilled-squad` - Fast, lightweight alternative
- `microsoft/DialoGPT-medium` - Conversational fallback

**Advanced Models (if you have HF Pro):**
- `deepset/roberta-large-squad2` - Highest accuracy
- `facebook/bart-large-cnn` - Great for summarization tasks

## 📊 Response Types

The system provides different response types with visual indicators:

| Type | Icon | Description |
|------|------|-------------|
| `rag_qa` | 🧠 | RAG system with QA model |
| `ai_with_constitution` | 🔍 | Traditional search + AI |
| `ai_general` | 🤖 | General AI response |
| `fallback` | 📄 | Basic search fallback |

## 🎯 Usage Examples

### RAG Mode (Recommended)
```javascript
// Frontend call with RAG enabled
const response = await sendQuery("What are the membership requirements?", sessionId, true);

// Response includes:
{
  text: "Based on the constitution...",
  responseType: "rag_qa",
  ragMetadata: {
    confidence: 0.87,
    model: "deepset/roberta-base-squad2",
    processingTime: 1250,
    contextChunks: 2
  }
}
```

### Traditional Mode
```javascript
// Frontend call with RAG disabled
const response = await sendQuery("What are the membership requirements?", sessionId, false);

// Uses original fuzzy search + AI approach
```

## 🔍 How RAG Works

1. **Query Analysis**: Determines if constitution context is needed
2. **Document Retrieval**: 
   - Searches document chunks using Fuse.js
   - Ranks results by relevance score
   - Combines top chunks into context (max 2000 chars)
3. **Answer Generation**:
   - Tries primary QA model (RoBERTa)
   - Falls back to generative model if needed
   - Extracts sentences as final fallback
4. **Response Formatting**: Adds confidence indicators and metadata

## 🛠️ Customization

### Adjusting RAG Parameters

In `cms-backend/server.js`, modify the RAG system initialization:

```javascript
ragSystem = new RAGSystem({
    qaModel: 'your-preferred-qa-model',
    maxRetrievedChunks: 5,        // More context chunks
    retrievalThreshold: 0.2,      // Lower = more permissive search
    maxContextLength: 3000,       // Longer context
    confidenceThreshold: 0.2      // Lower = accept more answers
});
```

### Adding New QA Models

1. Update environment variables:
```bash
HUGGINGFACE_QA_MODEL=new-model-name
```

2. Test model compatibility:
```bash
# Check if model supports question-answering
curl -X POST "https://api-inference.huggingface.co/models/your-model" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"inputs": {"question": "test", "context": "test"}}'
```

## 📈 Performance Optimization

### Backend Optimizations
- **Model Caching**: Hugging Face models are cached after first use
- **Context Limiting**: Prevents overly long prompts
- **Parallel Processing**: Multiple model attempts run efficiently
- **Session Management**: Maintains conversation context

### Frontend Optimizations
- **Lazy Loading**: RAG metadata only shown when available
- **Progressive Enhancement**: Works without RAG if backend fails
- **Responsive UI**: Settings panel adapts to screen size

## 🧪 Testing Your RAG System

### 1. Start the Backend
```bash
cd cms-backend
npm start
```

### 2. Test Different Query Types

**Constitution Questions** (RAG should activate):
- "What are the membership requirements?"
- "Who can be on the board?"
- "What are the objectives of COAZ?"

**General Questions** (Should use traditional AI):
- "Hello, how are you?"
- "What is anesthesiology?"

### 3. Monitor Response Types
- Check console logs for RAG system messages
- Observe UI indicators for response types
- Verify metadata display in chat

## 🔧 Troubleshooting

### Common Issues

**1. RAG System Not Initializing**
```bash
# Check console for:
[RAG] System initialized with QA model: deepset/roberta-base-squad2
[OK] RAG system initialized and documents indexed
```

**2. Models Failing**
- Verify Hugging Face API key (optional but helps)
- Check model names in configuration
- Monitor rate limits on free tier

**3. No RAG Responses**
- Ensure queries contain constitution-related keywords
- Check `needsConstitutionContext()` function
- Verify PDF documents are properly loaded

### Debug Mode

Enable detailed logging:
```bash
# Backend
LOG_LEVEL=debug

# Frontend  
REACT_APP_ENABLE_CONSOLE_LOGS=true
```

## 🚀 Next Steps

### Potential Enhancements
1. **Vector Search**: Implement semantic embeddings for better retrieval
2. **Multi-document Support**: Extend beyond constitution to other documents
3. **Fine-tuning**: Train custom models on COAZ-specific content
4. **Analytics**: Track query patterns and model performance
5. **Caching**: Cache frequent question-answer pairs

### Integration Opportunities
1. **Document Upload**: Allow users to upload and query their own documents
2. **Export Features**: Export conversations and insights
3. **Admin Dashboard**: Monitor RAG system performance
4. **API Extensions**: Expose RAG capabilities to other applications

## 📞 Support

The RAG system maintains backward compatibility with your existing setup. If any issues arise:

1. **Fallback Mode**: System automatically falls back to traditional search
2. **Error Handling**: Comprehensive error catching and user feedback
3. **Monitoring**: Detailed logging for troubleshooting

Your implementation now provides state-of-the-art document QA capabilities while maintaining the reliability of your existing system!
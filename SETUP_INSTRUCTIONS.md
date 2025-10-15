# RAG System Setup Instructions

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd cms-backend

# Install dependencies (if not already done)
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env file with your settings (optional but recommended)
# Add your Hugging Face API key for better performance:
# HUGGINGFACE_API_KEY=your_token_here

# Start the backend server
npm start
```

### 2. Frontend Setup

```bash
# Install frontend dependencies (if not already done)
npm install

# Start the React development server
npm start
```

### 3. Test the Implementation

```bash
# Run the test script to verify RAG system
cd cms-backend
node ../tmp_rovodev_test_rag.js
```

## 🔧 Configuration Options

### Environment Variables (.env)

```bash
# RAG System Configuration
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=                    # Optional - improves performance
HUGGINGFACE_QA_MODEL=deepset/roberta-base-squad2
HUGGINGFACE_FALLBACK_QA_MODEL=microsoft/DialoGPT-medium

# Server Configuration  
PORT=8080
NODE_ENV=development

# CORS (add your frontend URL)
CORS_ORIGINS=http://localhost:3000,https://coaz.org
```

## 🧪 Testing Your Implementation

### Frontend Testing
1. Open the React app in your browser
2. Click the chat bot icon (bottom right)
3. Click the settings gear icon
4. Toggle between "RAG Mode" and "Search Mode"
5. Ask constitution-related questions:
   - "What are the membership requirements?"
   - "What are COAZ's objectives?"
   - "Who can be on the board?"

### Backend Testing
```bash
# Test RAG status endpoint
curl http://localhost:8080/api/rag-status

# Test chat endpoint with RAG
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What are the membership requirements?", "useRag": true}'
```

## 🎯 What You Should See

### RAG Mode Responses
- **Visual Indicator**: 🧠 RAG icon in chat header
- **Response Type**: "🧠 RAG" badge on bot messages  
- **Metadata**: Confidence scores, processing times, model info
- **Higher Accuracy**: More precise answers to constitution questions

### Traditional Mode Responses  
- **Visual Indicator**: 🔍 Search icon in chat header
- **Response Type**: "🔍 Search+AI" badge on bot messages
- **Familiar Behavior**: Your original fuzzy search + AI approach

## 🔍 Understanding Response Types

| Icon | Type | Description |
|------|------|-------------|
| 🧠 | RAG | Advanced QA model with document retrieval |
| 🔍 | Search+AI | Traditional fuzzy search + AI generation |
| 🤖 | AI | General AI response (no document context) |
| 📄 | Fallback | Basic constitution search only |

## 🛠️ Customization

### Adjust RAG Sensitivity
In `cms-backend/server.js`, modify the initialization:

```javascript
ragSystem = new RAGSystem({
    maxRetrievedChunks: 5,        // More context chunks
    retrievalThreshold: 0.2,      // Lower = more permissive  
    confidenceThreshold: 0.1      // Lower = accept more answers
});
```

### Change QA Models
Update your `.env` file:

```bash
# For faster responses (less accurate)
HUGGINGFACE_QA_MODEL=distilbert-base-cased-distilled-squad

# For higher accuracy (slower)  
HUGGINGFACE_QA_MODEL=deepset/roberta-large-squad2
```

## 🔧 Troubleshooting

### Common Issues

**1. "RAG System: Disabled" in console**
- Check that `constitution.pdf` exists in `cms-backend/`
- Verify the PDF is readable and contains text
- Check console for PDF loading errors

**2. RAG responses not appearing**
- Ensure queries contain constitution keywords
- Try questions like "membership", "objectives", "board"
- Check that `useRag: true` is being sent from frontend

**3. Models failing/slow responses**
- Get a free Hugging Face API token: https://huggingface.co/settings/tokens
- Add to `.env`: `HUGGINGFACE_API_KEY=your_token`
- Restart your backend server

**4. Frontend not showing RAG controls**
- Clear browser cache and reload
- Check browser console for JavaScript errors
- Verify React development server is running

### Debug Mode

Enable detailed logging:

```bash
# Backend (.env)
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true

# Frontend (.env)
REACT_APP_ENABLE_CONSOLE_LOGS=true
```

## ✅ Success Indicators

You'll know the RAG system is working when you see:

### Backend Console:
```
[RAG] System initialized with QA model: deepset/roberta-base-squad2
[OK] RAG system initialized and documents indexed
RAG System: Enabled
Constitution sections: 25
```

### Frontend:
- Settings panel with RAG/Search mode toggle
- Visual mode indicators in chat header  
- Response type badges on messages
- RAG metadata display (confidence, timing, etc.)

## 🚀 Next Steps

Your RAG system is now ready! Consider these enhancements:

1. **Monitor Performance**: Track which queries work best with RAG
2. **User Feedback**: Add thumbs up/down for answer quality
3. **Analytics**: Log popular questions and response patterns
4. **Document Expansion**: Add more PDFs beyond the constitution
5. **Fine-tuning**: Train custom models on COAZ-specific content

## 📞 Support

The implementation maintains full backward compatibility. If anything goes wrong:
- RAG system automatically falls back to traditional search
- All original functionality remains intact
- Users can manually toggle between modes

Happy querying! 🎉
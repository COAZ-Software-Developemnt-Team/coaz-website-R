# COAZ Simple AI Chatbot Setup Guide

## Overview
This setup removes the complex RAG (vector database) system and simplifies the chatbot to use:
1. **Website scraper** - Fetches raw text from coaz.org pages  
2. **PDF loader** - Extracts raw text from constitution PDF
3. **4 Open-source AI models** - Llama3, Flan-T5, GPT-J, and Phi-4

## Quick Start

### 1. Backend Setup
```bash
# Navigate to backend
cd cms-backend

# Install dependencies (if needed)
npm install

# Start the simplified server
npm run start-simple
```

### 2. Frontend Setup  
```bash
# In project root
npm install
npm start
```

## Configuration

### Environment Variables (.env file)
The backend uses these key environment variables:

```bash
# Choose your AI model
AI_PROVIDER=llama3  # Options: llama3, flan-t5, gpt-j, phi-4, offline

# Hugging Face API Key (optional - improves performance)
HUGGINGFACE_API_KEY=your_hf_token_here

# Model-specific settings
LLAMA3_MODEL=meta-llama/Llama-2-7b-chat-hf
LLAMA3_MAX_TOKENS=500
LLAMA3_TEMPERATURE=0.7

FLAN_T5_MODEL=google/flan-t5-large
FLAN_T5_MAX_TOKENS=512  
FLAN_T5_TEMPERATURE=0.5

GPT_J_MODEL=EleutherAI/gpt-j-6b
GPT_J_MAX_TOKENS=500
GPT_J_TEMPERATURE=0.7

PHI_4_MODEL=microsoft/phi-2
PHI_4_MAX_TOKENS=500
PHI_4_TEMPERATURE=0.6
```

## How It Works

### 1. Knowledge Sources (No Vector DB)
- **Website Content**: Scraped as raw text from coaz.org pages
- **PDF Content**: Constitution text extracted as plain text
- **Combined Knowledge**: Simple text search and matching

### 2. AI Model Selection
Switch between models by changing `AI_PROVIDER` in .env:

- **llama3**: Best for conversational responses
- **flan-t5**: Good for question-answering tasks  
- **gpt-j**: General purpose text generation
- **phi-4**: Efficient smaller model

### 3. API Endpoints

#### Chat Endpoint
```bash
POST /api/chat
{
  "query": "What is COAZ?",
  "sessionId": "user123"
}
```

#### Switch Model
```bash
POST /api/switch-model  
{
  "provider": "flan-t5"
}
```

#### Refresh Website Data
```bash
POST /api/refresh-website
```

#### System Stats
```bash
GET /api/stats
```

## File Structure

### New Files Created:
```
cms-backend/
├── simple-ai-system.js    # New AI system (replaces RAG)
├── simple-server.js       # New simplified server  
└── .env                   # Updated environment config

.env.example               # Updated with new model options
SIMPLE_SETUP_GUIDE.md     # This guide
```

### Key Differences from RAG System:
- ❌ **Removed**: Vector database, embeddings, complex retrieval
- ❌ **Removed**: OpenAI dependency  
- ✅ **Kept**: Website scraping, PDF loading
- ✅ **Added**: 4 open-source model support
- ✅ **Added**: Simple text-based knowledge matching

## Usage Examples

### Start with default model (Llama3)
```bash
cd cms-backend
npm run start-simple
```

### Switch to different model at runtime
```bash
curl -X POST http://localhost:8080/api/switch-model \
  -H "Content-Type: application/json" \
  -d '{"provider": "flan-t5"}'
```

### Test the chatbot
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is COAZ?", "sessionId": "test"}'
```

## Performance Notes

### Model Performance (approximate):
- **Phi-4**: Fastest, smallest model
- **Flan-T5**: Good balance of speed/quality  
- **Llama3**: High quality, slower
- **GPT-J**: Large model, slowest but powerful

### Hugging Face API Key:
- **Without key**: Rate limited, slower responses
- **With key**: Better performance, higher rate limits
- **Get key**: https://huggingface.co/settings/tokens (free)

## Troubleshooting

### Common Issues:

1. **Model loading errors**
   - Solution: Try a different model or add HF API key

2. **Slow responses**  
   - Solution: Switch to smaller model (phi-4) or add API key

3. **Website scraping fails**
   - Solution: Check CORS_ORIGINS and website availability

4. **PDF not loading**
   - Solution: Ensure constitution.pdf exists in cms-backend/

### Debug Commands:
```bash
# Check system status
curl http://localhost:8080/api/health

# View system stats  
curl http://localhost:8080/api/stats

# Force website refresh
curl -X POST http://localhost:8080/api/refresh-website
```

## Next Steps

1. **Test the system**: Start both backend and frontend
2. **Try different models**: Switch AI_PROVIDER in .env
3. **Add HF API key**: For better performance
4. **Customize responses**: Modify simple-ai-system.js
5. **Add more content**: Upload PDFs or improve website scraping

The system is now simplified and ready for local development on Windows!
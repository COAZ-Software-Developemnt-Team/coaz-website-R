# COAZ Simple AI Chatbot

A simplified AI chatbot for the College of Anesthesiologists of Zambia (COAZ) that uses **open-source models** and **raw text processing** instead of complex RAG systems.

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd cms-backend
npm install
npm run start-simple
```

### 2. Frontend Setup
```bash
npm install  
npm start
```

### 3. Test the Setup
```bash
node test-simple-setup.js
```

## 🔧 Configuration

### Environment Variables (cms-backend/.env)
```bash
# Choose AI Model
AI_PROVIDER=llama3  # Options: llama3, flan-t5, gpt-j, phi-4

# Optional: Add Hugging Face API key for better performance
HUGGINGFACE_API_KEY=your_token_here

# Model Settings (automatically configured)
LLAMA3_MODEL=meta-llama/Llama-2-7b-chat-hf
FLAN_T5_MODEL=google/flan-t5-large
GPT_J_MODEL=EleutherAI/gpt-j-6b
PHI_4_MODEL=microsoft/phi-2
```

## 📋 What Changed

### ❌ Removed (Complex RAG System)
- Vector databases and embeddings
- OpenAI dependency
- Complex retrieval algorithms
- Heavy processing overhead

### ✅ Kept (Simple & Effective)
- Website scraping (raw text)
- PDF loading (raw text extraction)
- Session management
- Rate limiting and security

### ✅ Added (Open Source AI)
- **4 AI Models**: Llama3, Flan-T5, GPT-J, Phi-4
- **Model switching**: Change models at runtime
- **Simplified architecture**: Easy to understand and modify
- **Offline fallbacks**: Works without internet

## 🤖 AI Models

| Model | Best For | Speed | Quality |
|-------|----------|-------|---------|
| **Llama3** | Conversations | Medium | High |
| **Flan-T5** | Q&A Tasks | Fast | Good |
| **GPT-J** | General Text | Slow | High |
| **Phi-4** | Quick Responses | Fastest | Good |

## 🛠 API Endpoints

### Chat
```bash
POST /api/chat
{
  "query": "What is COAZ?",
  "sessionId": "user123"
}
```

### Switch Model
```bash
POST /api/switch-model
{
  "provider": "flan-t5"
}
```

### System Health
```bash
GET /api/health
```

### Refresh Data
```bash
POST /api/refresh-website
```

## 📁 New File Structure

```
├── cms-backend/
│   ├── simple-ai-system.js    # New AI system (replaces RAG)
│   ├── simple-server.js       # New simplified server
│   ├── .env                   # Updated configuration
│   └── package.json           # Added start-simple script
├── test-simple-setup.js       # Test script
├── SIMPLE_SETUP_GUIDE.md      # Detailed setup guide
└── README_SIMPLE.md           # This file
```

## 💡 How It Works

1. **Knowledge Loading**: 
   - Scrapes coaz.org pages as raw text
   - Loads PDF constitution as plain text
   - Combines into searchable knowledge base

2. **Query Processing**:
   - Finds relevant content using simple text matching
   - Sends context + query to selected AI model
   - Returns generated response

3. **Model Flexibility**:
   - Switch between 4 models based on needs
   - Each model optimized for different tasks
   - Automatic fallback to offline responses

## 🎯 Use Cases

### Perfect For:
- ✅ Local development on Windows
- ✅ Quick setup and testing
- ✅ Learning AI integration
- ✅ Cost-effective operation (free models)
- ✅ Offline capability

### Consider Original RAG For:
- 🔄 Production environments with heavy load
- 🔄 Large knowledge bases (100+ documents)
- 🔄 Complex semantic search requirements
- 🔄 Enterprise-grade accuracy needs

## 🚦 Getting Started

1. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd <project-directory>
   ```

2. **Start backend**:
   ```bash
   cd cms-backend
   npm run start-simple
   ```

3. **Start frontend** (new terminal):
   ```bash
   npm start
   ```

4. **Test everything**:
   ```bash
   node test-simple-setup.js
   ```

5. **Open browser**: http://localhost:3000

## 🔧 Customization

### Change AI Model:
```bash
# Edit cms-backend/.env
AI_PROVIDER=flan-t5  # or llama3, gpt-j, phi-4
```

### Add Your Own Content:
```javascript
// Edit simple-ai-system.js
aiSystem.loadPdfContent("Your custom text here");
```

### Modify Responses:
```javascript
// Edit simple-ai-system.js > generateOfflineResponse()
// Add custom patterns and responses
```

## 📞 Support

- **Setup Issues**: Check `SIMPLE_SETUP_GUIDE.md`
- **API Testing**: Use `test-simple-setup.js`
- **Model Problems**: Try different `AI_PROVIDER` settings
- **Performance**: Add `HUGGINGFACE_API_KEY`

## 🌟 Benefits of Simple Setup

- **Fast Development**: Get running in minutes
- **Easy Understanding**: Clear, simple codebase
- **Cost Effective**: Free open-source models
- **Windows Friendly**: Designed for local development
- **Flexible**: Switch models based on needs
- **Maintainable**: Straightforward architecture

Ready to build your COAZ chatbot! 🎉
# 🔧 COAZ Chatbot Environment Configuration Guide

This guide covers all environment variables for both the React frontend and Node.js backend.

## 📁 File Structure

```
project-root/
├── .env                    # Frontend environment variables
├── .env.example           # Frontend environment template
├── cms-backend/
│   ├── .env              # Backend environment variables
│   ├── .env.example      # Backend environment template
│   └── CONFIG.md         # Backend configuration guide
└── ENVIRONMENT_SETUP.md  # This file
```

## 🎯 Quick Setup

### 1. Frontend Setup (React)
```bash
# Copy the example file
cp .env.example .env

# No changes needed for development - defaults work out of the box!
```

### 2. Backend Setup (Node.js)
```bash
# Copy the example file
cp cms-backend/.env.example cms-backend/.env

# Add your OpenAI API key
# Edit cms-backend/.env and replace:
OPENAI_API_KEY=your-actual-openai-api-key-here
```

### 3. Start Both Servers
```bash
# Terminal 1 - Backend
cd cms-backend
npm start

# Terminal 2 - Frontend  
npm start
```

## 🔍 Environment Variables Reference

### ✅ Frontend (.env)

| Variable | Current Value | Purpose | Required |
|----------|---------------|---------|----------|
| `NODE_ENV` | `development` | Environment mode | Auto-set |
| `REACT_APP_API_BASE_URL` | `http://localhost:8080` | API endpoint | ✅ |
| `REACT_APP_CHATBOT_WELCOME_MESSAGE` | Welcome text | Bot greeting | No |
| `REACT_APP_CHATBOT_PLACEHOLDER` | Input placeholder | Input hint | No |
| `REACT_APP_ENABLE_QUICK_ACTIONS` | `true` | Show quick buttons | No |
| `REACT_APP_ENABLE_MESSAGE_PERSISTENCE` | `true` | Save chat history | No |
| `REACT_APP_ENABLE_TYPING_INDICATOR` | `true` | Show typing dots | No |
| `REACT_APP_ENABLE_COPY_MESSAGES` | `true` | Copy button | No |
| `REACT_APP_ENABLE_TIMESTAMPS` | `true` | Message timestamps | No |

### ✅ Backend (cms-backend/.env)

| Variable | Current Value | Purpose | Required |
|----------|---------------|---------|----------|
| `OPENAI_API_KEY` | `sk-proj-...` | AI responses | ✅ |
| `PORT` | `8080` | Server port | No |
| `NODE_ENV` | `development` | Environment mode | No |
| `OPENAI_MODEL` | `gpt-3.5-turbo` | AI model | No |
| `OPENAI_MAX_TOKENS` | `500` | Response length | No |

## 🎨 Feature Toggles

You can enable/disable features by changing these values:

### Frontend Features
```bash
# In .env file:
REACT_APP_ENABLE_QUICK_ACTIONS=false      # Hide quick action buttons
REACT_APP_ENABLE_MESSAGE_PERSISTENCE=false # Don't save chat history
REACT_APP_ENABLE_TYPING_INDICATOR=false   # Hide typing animation
REACT_APP_ENABLE_COPY_MESSAGES=false      # Hide copy buttons
REACT_APP_ENABLE_TIMESTAMPS=false         # Hide message times
```

### Backend Features
```bash
# In cms-backend/.env file:
OPENAI_MODEL=gpt-4                        # Use GPT-4 (requires higher API tier)
OPENAI_MAX_TOKENS=1000                    # Longer responses
OPENAI_TEMPERATURE=0.3                    # More focused responses
```

## 🌍 Environment Modes

### Development (Default)
- API: `http://localhost:8080`
- Console logs enabled
- All features enabled
- No rate limiting

### Production
```bash
# Frontend (.env):
NODE_ENV=production
REACT_APP_API_BASE_URL=https://coaz.org

# Backend (cms-backend/.env):
NODE_ENV=production
OPENAI_MODEL=gpt-3.5-turbo
RATE_LIMIT_MAX_REQUESTS=50
```

## 🔐 Security Best Practices

### ✅ Do's
- ✅ Use `.env.example` files for templates
- ✅ Add `.env` to `.gitignore`
- ✅ Use `REACT_APP_` prefix for frontend variables
- ✅ Keep API keys secure
- ✅ Use environment-specific values

### ❌ Don'ts
- ❌ Never commit `.env` files to Git
- ❌ Don't store secrets in frontend `.env`
- ❌ Don't use production keys in development
- ❌ Don't hardcode sensitive values

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** Variables not updating
```bash
# Solution: Restart development server
npm start
```

**Problem:** API connection failed
```bash
# Check backend is running on port 8080
curl http://localhost:8080/api/chat

# Check REACT_APP_API_BASE_URL in .env
```

### Backend Issues

**Problem:** OpenAI API errors
```bash
# Check API key in cms-backend/.env
# Verify key at: https://platform.openai.com/api-keys
```

**Problem:** Port conflicts
```bash
# Change port in cms-backend/.env
PORT=3001
```

## 📊 Current Configuration Status

### ✅ Fully Configured
- Frontend environment variables
- Backend environment variables  
- AI integration with OpenAI
- Session management
- Message persistence
- UI feature toggles

### 🔄 Ready for Enhancement
- Rate limiting
- Advanced logging
- Analytics tracking
- Voice input
- File uploads

## 🚀 Next Steps

1. **Get OpenAI API Key**: Visit https://platform.openai.com/api-keys
2. **Test the Chatbot**: Ask questions about the constitution
3. **Customize Settings**: Modify environment variables as needed
4. **Deploy to Production**: Use production environment values

---

**Need Help?** Check the individual config files:
- Frontend: See comments in `.env`
- Backend: See `cms-backend/CONFIG.md`
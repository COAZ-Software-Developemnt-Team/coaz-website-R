# COAZ Chatbot Configuration Guide

## 🔧 Environment Variables

This document explains all environment variables used in the COAZ chatbot backend.

### ✅ Currently Active Variables

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI responses | Yes | - | `sk-proj-...` |
| `PORT` | Server port number | No | `8080` | `8080` |

### 🔄 Future Enhancement Variables

These variables are defined for future features but not yet implemented in the code:

#### Server & Environment
| Variable | Description | Default | Usage |
|----------|-------------|---------|-------|
| `NODE_ENV` | Environment mode | `development` | Controls logging, error handling |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000,https://coaz.org` | Security configuration |

#### OpenAI Configuration
| Variable | Description | Default | Usage |
|----------|-------------|---------|-------|
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` | AI model selection |
| `OPENAI_MAX_TOKENS` | Maximum response tokens | `500` | Response length control |
| `OPENAI_TEMPERATURE` | AI creativity level | `0.7` | Response randomness (0-1) |

#### Conversation Management
| Variable | Description | Default | Usage |
|----------|-------------|---------|-------|
| `MAX_CONVERSATION_HISTORY` | Messages to keep in memory | `20` | Conversation context size |
| `SESSION_TIMEOUT_MINUTES` | Session expiry time | `60` | Auto-cleanup inactive sessions |

#### Rate Limiting
| Variable | Description | Default | Usage |
|----------|-------------|---------|-------|
| `RATE_LIMIT_WINDOW_MINUTES` | Rate limit time window | `15` | Prevent API abuse |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | Request throttling |

#### Logging & Monitoring
| Variable | Description | Default | Usage |
|----------|-------------|---------|-------|
| `LOG_LEVEL` | Logging verbosity | `info` | Debug, info, warn, error |
| `ENABLE_REQUEST_LOGGING` | Log all requests | `true` | Request monitoring |

#### File Processing
| Variable | Description | Default | Usage |
|----------|-------------|---------|-------|
| `CONSTITUTION_PDF_PATH` | Path to constitution PDF | `./constitution.pdf` | Document location |

## 🚀 Implementation Status

### ✅ Implemented Features
- ✅ OpenAI API integration
- ✅ Port configuration
- ✅ Basic CORS setup
- ✅ Constitution PDF processing
- ✅ Session-based conversations

### 🔄 Ready for Implementation
- Rate limiting middleware
- Advanced logging system
- Environment-based configuration
- Dynamic CORS origins
- Configurable AI parameters
- Session timeout management

## 🛠 Quick Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Set your OpenAI API key:**
   ```bash
   # Edit .env file
   OPENAI_API_KEY=your-actual-api-key-here
   ```

3. **Customize other settings** (optional):
   ```bash
   PORT=3001
   NODE_ENV=production
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

## 🔐 Security Notes

- ⚠️ Never commit `.env` files to version control
- 🔑 Keep OpenAI API keys secure
- 🌐 Configure CORS_ORIGINS for production
- 🔒 Enable rate limiting in production
- 📝 Monitor logs for suspicious activity

## 🔍 Troubleshooting

### Common Issues

1. **Missing OpenAI API Key:**
   ```
   Error: OpenAI API key is required
   Solution: Set OPENAI_API_KEY in .env file
   ```

2. **Port Already in Use:**
   ```
   Error: Port 8080 is already in use
   Solution: Change PORT in .env file
   ```

3. **CORS Issues:**
   ```
   Error: CORS policy blocks request
   Solution: Add your domain to CORS_ORIGINS
   ```

## 📚 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Express.js Environment Variables](https://expressjs.com/en/guide/using-middleware.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
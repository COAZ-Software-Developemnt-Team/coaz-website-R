// Load environment variables first
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdf-parse');
const fs = require('fs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const helmet = require('helmet');
const compression = require('compression');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { JSDOM } = require('jsdom');
const path = require('path');

// Import our multi-provider AI system
const MultiProviderAISystem = require('./multi-provider-ai-system');

const app = express();

// Configuration from environment variables
const config = {
    port: parseInt(process.env.PORT) || 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'https://coaz.org'],

    ai: {
        provider: process.env.AI_PROVIDER || 'ai_horde',
        fallbackToMock: process.env.AI_FALLBACK_TO_MOCK !== 'false',
        timeout: parseInt(process.env.AI_TIMEOUT) || 120000, // Increased to 2 minutes for AI Horde polling
        maxRetries: parseInt(process.env.AI_MAX_RETRIES) || 2
    },

    webScraping: {
        enabled: process.env.WEB_SCRAPING_ENABLED !== 'false',
        coazWebsite: process.env.COAZ_WEBSITE_URL || 'https://coaz.org',
        cacheTimeout: parseInt(process.env.WEB_CACHE_TIMEOUT) || 3600000, // 1 hour
        useJavaScriptRendering: true, // Force enable JS rendering
        enhancedExtraction: process.env.ENHANCED_EXTRACTION !== 'false',
        indexPath: process.env.WEBSITE_INDEX_PATH || path.join(__dirname, 'website-index.json')
    },

    huggingface: {
        apiKey: process.env.HUGGINGFACE_API_KEY || ''
    },

    models: {
        llama3: {
            model: process.env.LLAMA3_MODEL || 'meta-llama/Llama-2-7b-chat-hf',
            maxTokens: parseInt(process.env.LLAMA3_MAX_TOKENS) || 500,
            temperature: parseFloat(process.env.LLAMA3_TEMPERATURE) || 0.7
        },
        'flan-t5': {
            model: process.env.FLAN_T5_MODEL || 'google/flan-t5-large',
            maxTokens: parseInt(process.env.FLAN_T5_MAX_TOKENS) || 512,
            temperature: parseFloat(process.env.FLAN_T5_TEMPERATURE) || 0.5
        },
        'gpt-j': {
            model: process.env.GPT_J_MODEL || 'EleutherAI/gpt-j-6b',
            maxTokens: parseInt(process.env.GPT_J_MAX_TOKENS) || 500,
            temperature: parseFloat(process.env.GPT_J_TEMPERATURE) || 0.7
        },
        'phi-4': {
            model: process.env.PHI_4_MODEL || 'microsoft/phi-2',
            maxTokens: parseInt(process.env.PHI_4_MAX_TOKENS) || 500,
            temperature: parseFloat(process.env.PHI_4_TEMPERATURE) || 0.6
        }
    },

    conversation: {
        maxHistory: parseInt(process.env.MAX_CONVERSATION_HISTORY) || 20,
        sessionTimeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES) || 60
    },

    rateLimit: {
        windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
        enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true'
    },

    pdf: {
        constitutionPath: process.env.CONSTITUTION_PDF_PATH || './constitution.pdf'
    }
};

// Enhanced logging setup
const logger = winston.createLogger({
    level: config.logging.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'coaz-simple-chatbot' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Add console logging in development
if (config.nodeEnv !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

// Initialize Multi-Provider AI System
const aiSystem = new MultiProviderAISystem({
    primaryProvider: config.ai.provider,
    fallbackToMock: config.ai.fallbackToMock,
    timeout: config.ai.timeout,
    maxRetries: config.ai.maxRetries
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use(compression());

// Rate limiting
const rateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMinutes * 60 * 1000,
    max: config.rateLimit.maxRequests,
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: `${config.rateLimit.windowMinutes} minutes`
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/chat', rateLimiter);

// CORS configuration
const corsOptions = {
    origin: config.corsOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
if (config.logging.enableRequestLogging) {
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
        });
        next();
    });
}

// Global variables
let websiteCache = {
    data: null,
    lastUpdated: null,
    isLoading: false
};

// Enhanced session management
class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.cleanup();
    }

    getSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastActivity = Date.now();
            return session;
        }

        const newSession = {
            id: sessionId,
            history: [],
            createdAt: Date.now(),
            lastActivity: Date.now()
        };

        this.sessions.set(sessionId, newSession);
        logger.info(`Created new session: ${sessionId}`);
        return newSession;
    }

    updateSessionHistory(sessionId, userMessage, botResponse) {
        const session = this.getSession(sessionId);
        session.history.push(
            { role: "user", content: userMessage },
            { role: "assistant", content: botResponse }
        );

        if (session.history.length > config.conversation.maxHistory) {
            session.history.splice(0, session.history.length - config.conversation.maxHistory);
        }

        session.lastActivity = Date.now();
    }

    cleanup() {
        setInterval(() => {
            const now = Date.now();
            const timeoutMs = config.conversation.sessionTimeoutMinutes * 60 * 1000;

            for (const [sessionId, session] of this.sessions.entries()) {
                if (now - session.lastActivity > timeoutMs) {
                    this.sessions.delete(sessionId);
                    logger.info(`Session expired and cleaned up: ${sessionId}`);
                }
            }
        }, 5 * 60 * 1000);
    }

    getStats() {
        return {
            activeSessions: this.sessions.size,
            sessions: Array.from(this.sessions.values()).map(s => ({
                id: s.id,
                messageCount: s.history.length,
                createdAt: s.createdAt,
                lastActivity: s.lastActivity
            }))
        };
    }
}

const sessionManager = new SessionManager();

// Load constitution PDF
async function loadConstitution() {
    try {
        const dataBuffer = fs.readFileSync(path.join(__dirname, 'constitution.pdf'));
        const data = await pdf(dataBuffer);

        console.log('[PDF] Constitution loaded successfully!');
        console.log(`[PDF] Extracted ${data.text.length} characters from PDF`);

        // Load PDF content into AI system
        aiSystem.loadPdfContent(data.text);

        return data.text;
    } catch (error) {
        console.error('[PDF] Failed to load constitution:', error.message);
        return null;
    }
}

// Website scraping functions
async function scrapeCoazWebsite(force = false) {
    if (!config.webScraping.enabled) {
        console.log('[WEB] Web scraping disabled');
        return null;
    }

    const now = Date.now();
    // if (!force && websiteCache.data && websiteCache.lastUpdated &&
    //     (now - websiteCache.lastUpdated) < config.webScraping.cacheTimeout) {
    //     console.log('[WEB] Using cached website data');
    //     return websiteCache.data;
    // }

    if (websiteCache.isLoading) {
        console.log('[WEB] Already loading website data');
        return websiteCache.data;
    }

    try {
        websiteCache.isLoading = true;
        console.log(`[WEB] Starting website scrape: ${config.webScraping.coazWebsite}`);

        const discoveredUrls = await discoverWebsitePages(config.webScraping.coazWebsite);
        console.log(`[WEB] Discovered ${discoveredUrls.length} pages to scrape`);

        // Scrape all discovered pages using the working functions
        const allPageData = await scrapeMultiplePages(discoveredUrls);
        console.log(`[WEB] 📄 Successfully scraped ${allPageData.length} out of ${discoveredUrls.length} pages`);

        // Index and consolidate all content using the working function
        const websiteData = indexWebsiteContent(allPageData);

        console.log(`[WEB] Successfully crawled and indexed ${allPageData.length} pages`);

        websiteCache.data = websiteData;
        websiteCache.lastUpdated = now;

        // Save to file
        try {
            fs.writeFileSync(config.webScraping.indexPath, JSON.stringify(websiteData, null, 2));
            console.log(`[WEB] Saved website index to ${config.webScraping.indexPath}`);
        } catch (saveError) {
            console.warn('[WEB] Failed to save website index:', saveError.message);
        }

        // Load website content into AI system - convert data structure
        const aiCompatibleData = {
            pages: websiteData.pages.map(page => ({
                url: page.url,
                title: page.title,
                content: Array.isArray(page.content) 
                    ? page.content.map(c => c.text || c).join(' ') 
                    : (page.content || ''),
                description: page.description || '',
                scrapedAt: page.scrapedAt
            }))
        };
        
        aiSystem.loadWebsiteContent(aiCompatibleData);

        console.log(`[WEB] Successfully scraped ${allPageData.length} pages`);
        return websiteData;

    } catch (error) {
        console.error('[WEB] Website scraping failed:', error.message);
        return null;
    } finally {
        websiteCache.isLoading = false;
    }
}

async function discoverWebsitePages(baseUrl) {
    const discovered = new Set();

    // Add the main page
    discovered.add(baseUrl);

    // Specific COAZ pages from the navigation structure (copied from working server.js)
    const specificPages = [
        '/home',
        '/association/delivering_care',
        '/association/professional_practice',
        '/association/training_institutions_and_students',
        '/association/advocacy_in_health_care',
        '/association/member_benefits',
        '/about',
        '/news',
        '/services',
        '/categories',
        '/organisation',
        '/membership',
        '/contact',
        '/login',
        '/register'
    ];

    console.log(`[WEB] Adding specific COAZ navigation pages...`);

    // Convert relative URLs to absolute and add to discovery
    specificPages.forEach(page => {
        try {
            const fullUrl = new URL(page, baseUrl).href;
            discovered.add(fullUrl);
            console.log(`[WEB] Target page: ${fullUrl}`);
        } catch (error) {
            console.log(`[WEB] Skipping invalid URL: ${page}`);
        }
    });

    console.log(`[WEB] 🎯 Discovery complete! Found ${discovered.size} total pages`);
    return Array.from(discovered);
}

// EXACT working scraping functions from server.js (fixed version)
async function scrapeMultiplePages(urls) {
    console.log(`[WEB] 🚀 Starting enhanced multi-page scraping for ${urls.length} pages...`);

    const maxConcurrent = 3; // Limit concurrent requests
    const allPageData = [];

    for (let i = 0; i < urls.length; i += maxConcurrent) {
        const batch = urls.slice(i, i + maxConcurrent);
        const batchPromises = batch.map(url => scrapeSinglePage(url));

        try {
            const batchResults = await Promise.allSettled(batchPromises);
            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    allPageData.push(result.value);
                } else {
                    console.error(`[WEB] Failed to scrape: ${batch[index]}`);
                }
            });
        } catch (error) {
            console.error(`[WEB] Batch scraping error: ${error.message}`);
        }

        // Small delay between batches to be respectful
        if (i + maxConcurrent < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return allPageData;
}

// Enhanced scraping with JavaScript rendering and better content extraction
async function scrapeSinglePage(url) {
    try {
        // console.log(`[WEB] 📄 Enhanced scraping: ${url}`);

        let pageData;

        // Try JavaScript rendering first for dynamic content
        if (config.webScraping.useJavaScriptRendering) {
            pageData = await scrapeWithJavaScript(url);
            if (pageData) {
                console.log(`[WEB] ✅ JS rendering successful for: ${url}`);
                return pageData;
            }
            console.log(`[WEB] ⚠️ JS rendering failed, falling back to static scraping for: ${url}`);
        }

        // Static fallback disabled per request; return null to skip
        return null;

    } catch (error) {
        console.error(`[WEB] ❌ Error scraping ${url}: ${error.message}`);
        return null;
    }
}

// JavaScript rendering with Puppeteer for dynamic content (EXACT copy from server.js)
async function scrapeWithJavaScript(url) {
    let browser;
    try {
        // console.log(`[WEB] 🚀 Launching browser for JS rendering: ${url}`);

        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Capture JSON/XHR responses for SPA data
        const apiPayloads = [];
        page.on('response', async (response) => {
            try {
                const req = response.request();
                const urlStr = req.url();
                const sameOrigin = urlStr.startsWith(new URL(url).origin);
                const ct = response.headers()['content-type'] || '';
                if (sameOrigin && ct.includes('application/json')) {
                    const text = await response.text();
                    if (text && text.length < 2_000_000) {
                        apiPayloads.push({ url: urlStr, body: text.slice(0, 8000) });
                    }
                }
            } catch {}
        });

        // Set user agent and viewport
        await page.setUserAgent('COAZ-Chatbot/1.0 (Enhanced Scraper with JavaScript)');
        await page.setViewport({ width: 1280, height: 720 });

        // Navigate and wait for content to load
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 100000
        });

        // Wait for dynamic content to load (SPA render) - FIXED: using setTimeout instead of waitForTimeout
        await new Promise(resolve => setTimeout(resolve, 6000));

        // Scroll to bottom to trigger lazy load, then back to top
        try {
            await page.evaluate(async () => {
                await new Promise(resolve => {
                    let totalHeight = 0;
                    const distance = 800;
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= scrollHeight - window.innerHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 200);
                });
            });
            await new Promise(resolve => setTimeout(resolve, 1500));
            await page.evaluate(() => window.scrollTo(0, 0));
        } catch {}

        // Extract content using enhanced selectors
        const pageData = await page.evaluate((pageUrl) => {
            const data = {
                url: pageUrl,
                title: document.title || '',
                description: '',
                headings: [],
                content: [],
                contact: {
                    phones: [],
                    emails: [],
                    addresses: []
                },
                navigation: [],
                lastScraped: Date.now()
            };

            // Get meta description
            const metaDesc = document.querySelector('meta[name="description"]') || document.querySelector('meta[property="og:description"]');
            if (metaDesc) data.description = metaDesc.getAttribute('content') || '';

            // Extract headings with better context
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
                document.querySelectorAll(tag).forEach(heading => {
                    const text = heading.textContent.trim();
                    if (text && text.length > 3) {
                        data.headings.push({
                            level: tag,
                            text: text,
                            id: heading.id || null
                        });
                    }
                });
            });

            // Enhanced content extraction from meaningful containers
            const contentSelectors = [
                '#root', '#app', 'main', 'article', 'section', '.content', '.main-content',
                '.container', '.page-content', '.post-content', '.entry-content',
                'div[class*="content"]', 'div[class*="text"]', 'div[class*="description"]',
                'p', 'div'
            ];

            const extractedContent = new Set();

            contentSelectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(element => {
                        const text = (element.innerText || element.textContent || '').trim();

                        // Filter out navigation, header, footer content
                        const isNavigationContent = element.closest('nav, header, footer, .nav, .menu, .navigation, .header, .footer');
                        const isScriptContent = element.tagName === 'SCRIPT' || element.tagName === 'STYLE';

                        if (!isNavigationContent && !isScriptContent && text && text.length > 50) {
                            // Avoid duplicate content
                            if (!extractedContent.has(text)) {
                                extractedContent.add(text);
                                data.content.push({
                                    selector: selector,
                                    text: text.substring(0, 2000)
                                });
                            }
                        }
                    });
                } catch (e) {
                    // Ignore selector errors
                }
            });

            // Also collect alt/aria labels that might include event names like AGM
            document.querySelectorAll('[aria-label], img[alt]').forEach(el => {
                const t = (el.getAttribute('aria-label') || el.getAttribute('alt') || '').trim();
                if (t && t.length > 3) {
                    data.content.push({ selector: 'aria/alt', text: t.substring(0, 500) });
                }
            });

            // Fallback: if no structured content captured, include a sanitized body text excerpt
            if (data.content.length === 0) {
                const bodyText = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
                if (bodyText && bodyText.length > 50) {
                    data.content.push({ selector: 'body', text: bodyText.substring(0, 8000) });
                }
            }

            // Always include a capped full-page innerText block to guarantee indexability
            const fullInner = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
            if (fullInner && fullInner.length > 50) {
                data.content.push({ selector: 'fulltext', text: fullInner.substring(0, 12000) });
            }

            // Tag extraction for common events like AGM
            const lower = fullInner.toLowerCase();
            if (lower.includes('agm') || lower.includes('annual general meeting')) {
                data.content.push({ selector: 'tag', text: 'AGM (Annual General Meeting)' });
            }

            // Extract contact information with enhanced patterns
            const bodyText = document.body.textContent;

            // Phone number extraction
            const phonePatterns = [
                /(\+260[\d\s\-()]{9,15})/g,
                /(260[\d\s\-()]{9,})/g,
                /(\d{3}[\s\-]?\d{3}[\s\-]?\d{4})/g,
                /((?:\+|00)\d{1,3}[\s\-]?\d{6,14})/g
            ];

            phonePatterns.forEach(pattern => {
                const matches = [...bodyText.matchAll(pattern)];
                matches.forEach(match => {
                    const phone = match[1].trim();
                    if (phone.length >= 9 && !data.contact.phones.includes(phone)) {
                        data.contact.phones.push(phone);
                    }
                });
            });

            // Email extraction
            const emailMatches = [...bodyText.matchAll(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)];
            emailMatches.forEach(match => {
                const email = match[1].trim();
                if (!data.contact.emails.includes(email)) {
                    data.contact.emails.push(email);
                }
            });

            // Navigation links
            document.querySelectorAll('a[href]').forEach(link => {
                const href = link.getAttribute('href');
                const text = link.textContent.trim();
                if (href && text && text.length > 2 && text.length < 100) {
                    data.navigation.push({ text, href });
                }
            });

            return data;
        }, url);

        // Attach captured API payloads into content to make them searchable
        if (apiPayloads.length) {
            // console.log(`[WEB] 📡 Adding ${apiPayloads.length} API payload(s) to content...`);
            apiPayloads.forEach((payload, index) => {
                pageData.content.push({
                    selector: 'api-payload',
                    text: `API Response ${index + 1}: ${payload.body}`
                });
            });
        }

        console.log(`[WEB] ✅ Scraped content for ${url}: ${pageData.content.length} content blocks, ${pageData.headings.length} headings`);
        return pageData;

    } catch (error) {
        console.error(`[WEB] ❌ JS scraping failed for ${url}: ${error.message}`);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function scrapePage(url) {
    try {
        console.log(`[WEB] 📄 Scraping: ${url}`);

        const response = await axios.get(url, {
            timeout: 20000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });

        const $ = cheerio.load(response.data);

        // Enhanced content extraction
        // Remove unwanted elements more thoroughly
        $('script, style, nav, footer, header, .nav, .menu, .sidebar, .advertisement, .ads, .social-media, .comment, .comments, noscript, iframe').remove();

        // Extract title with fallbacks
        const title = $('title').text().trim() ||
            $('h1').first().text().trim() ||
            $('h2').first().text().trim() ||
            $('meta[property="og:title"]').attr('content') ||
            'Untitled Page';

        // Enhanced content extraction with multiple strategies
        let content = '';

        // Strategy 1: Look for main content areas
        const contentSelectors = [
            'main',
            '.content',
            '#content',
            '.main-content',
            '.page-content',
            '.post-content',
            '.entry-content',
            '.article-content',
            'article',
            '.post',
            '.entry',
            '.page'
        ];

        for (const selector of contentSelectors) {
            const element = $(selector);
            if (element.length > 0) {
                content = element.text().trim();
                if (content.length > 200) { // Ensure we have substantial content
                    break;
                }
            }
        }

        // Strategy 2: Extract from body but filter out navigation/boilerplate
        if (!content || content.length < 200) {
            // Remove navigation and other non-content elements
            $('nav, .navigation, .nav-menu, .menu, .breadcrumb, .pagination, .widget, .sidebar').remove();
            content = $('body').text().trim();
        }

        // Strategy 3: Look for paragraphs and headings
        if (!content || content.length < 200) {
            const paragraphs = $('p, h1, h2, h3, h4, h5, h6').map((_, el) => $(el).text().trim()).get();
            content = paragraphs.filter(p => p.length > 20).join(' ');
        }

        // Clean up content extensively
        content = content
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .replace(/\t+/g, ' ') // Replace tabs with spaces
            .replace(/[^\w\s.,!?;:()\-"']/g, ' ') // Remove special characters but keep punctuation
            .replace(/\b(Home|Menu|Login|Register|About Us|Contact|Privacy Policy|Terms|Copyright|All Rights Reserved)\b/gi, '') // Remove common navigation text
            .trim();

        // Validate content quality
        if (content.length < 100) {
            console.log(`[WEB] ⚠️  Skipping ${url} - insufficient content (${content.length} chars)`);
            return null;
        }

        // Extract additional metadata
        const description = $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') || '';

        const keywords = $('meta[name="keywords"]').attr('content') || '';

        const result = {
            url,
            title: title.substring(0, 200), // Limit title length
            content: content.substring(0, 5000), // Limit content length
            description: description.substring(0, 300),
            keywords: keywords.substring(0, 200),
            scrapedAt: new Date().toISOString(),
            contentLength: content.length
        };

        console.log(`[WEB] ✅ Successfully scraped: ${title} (${content.length} chars)`);
        return result;

    } catch (error) {
        console.error(`[WEB] ❌ Error scraping ${url}:`, error.message);
        return null;
    }
}

// Load persisted website index if present
try {
    if (fs.existsSync(config.webScraping.indexPath)) {
        const persisted = JSON.parse(fs.readFileSync(config.webScraping.indexPath, 'utf8'));
        if (persisted && persisted.pages && Array.isArray(persisted.pages)) {
            websiteCache.data = persisted;
            websiteCache.lastUpdated = persisted.lastIndexed || Date.now();
            
            // Convert persisted data to AI-compatible format
            const aiCompatibleData = {
                pages: persisted.pages.map(page => ({
                    url: page.url,
                    title: page.title,
                    content: Array.isArray(page.content) 
                        ? page.content.map(c => c.text || c).join(' ') 
                        : (page.content || ''),
                    description: page.description || '',
                    scrapedAt: page.scrapedAt
                }))
            };
            
            aiSystem.loadWebsiteContent(aiCompatibleData);
            console.log(`[WEB] Loaded persisted website index with ${persisted.pages.length} pages`);
        }
    }
} catch (e) {
    console.warn('[WEB] Failed to load persisted website index:', e.message);
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    const stats = aiSystem.getStats();
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        config: {
            aiProvider: config.ai.provider,
            webScrapingEnabled: config.webScraping.enabled
        },
        aiSystem: stats,
        sessions: sessionManager.getStats()
    });
});

// Main chat endpoint
app.post('/api/chat', [
    body('query').isString().isLength({ min: 1, max: 1000 }).trim(),
    body('sessionId').optional().isString().isLength({ max: 100 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid input',
                details: errors.array()
            });
        }

        const { query, sessionId = 'default' } = req.body;
        const session = sessionManager.getSession(sessionId);

        console.log(`[API] Processing query: "${query}" for session: ${sessionId}`);

        // Generate AI response
        const response = await aiSystem.generateResponse(query, session.history);

        // Update session history
        sessionManager.updateSessionHistory(sessionId, query, response.text);

        // Return response
        res.json({
            text: response.text,
            sessionId,
            metadata: {
                model: response.model,
                provider: response.provider,
                relevantSources: response.relevantSources,
                processingTime: response.processingTime
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        logger.error('Chat endpoint error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Unable to process your request. Please try again.'
        });
    }
});

// Provider switching endpoint
app.post('/api/switch-provider', [
    body('provider').isIn(['ai_horde', 'transformers_js', 'mock'])
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid AI provider',
                availableProviders: ['ai_horde', 'transformers_js', 'mock']
            });
        }

        const { provider } = req.body;
        const success = aiSystem.switchProvider(provider);

        if (success) {
            res.json({
                message: `Successfully switched to ${provider}`,
                currentProvider: aiSystem.getStats().primaryProvider,
                workingProviders: aiSystem.getStats().workingProviders
            });
        } else {
            res.status(400).json({
                error: `Failed to switch to ${provider}`,
                currentProvider: aiSystem.getStats().primaryProvider
            });
        }

    } catch (error) {
        logger.error('Provider switching error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Test provider endpoint
app.post('/api/test-provider', [
    body('provider').isIn(['ai_horde', 'transformers_js', 'mock'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Invalid AI provider',
                availableProviders: ['ai_horde', 'transformers_js', 'mock']
            });
        }

        const { provider } = req.body;
        const testResult = await aiSystem.testProvider(provider);

        res.json({
            provider,
            working: testResult.working,
            error: testResult.error || null,
            response: testResult.response || null
        });

    } catch (error) {
        logger.error('Provider testing error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Force website refresh endpoint
app.post('/api/refresh-website', async (req, res) => {
    try {
        console.log('[API] Forcing website refresh...');
        const websiteData = await scrapeCoazWebsite(true);

        res.json({
            message: 'Website data refreshed successfully',
            pagesScraped: websiteData ? websiteData.pages.length : 0,
            lastUpdated: websiteData ? websiteData.lastIndexed : null
        });

    } catch (error) {
        logger.error('Website refresh error:', error);
        res.status(500).json({
            error: 'Failed to refresh website data'
        });
    }
});

// Get system statistics
app.get('/api/stats', (req, res) => {
    res.json({
        aiSystem: aiSystem.getStats(),
        sessions: sessionManager.getStats(),
        websiteCache: {
            hasData: !!websiteCache.data,
            lastUpdated: websiteCache.lastUpdated,
            pageCount: websiteCache.data ? websiteCache.data.pages.length : 0
        }
    });
});

// Initialize system
async function initializeSystem() {
    console.log('[INIT] Starting COAZ Simple Chatbot System...');
    console.log(`[INIT] AI Provider: ${config.ai.provider}`);

    // Load constitution PDF
    await loadConstitution();

    // Load website data
    await scrapeCoazWebsite();

    console.log('[INIT] System initialization complete');
}

// Start server
const server = app.listen(config.port, async () => {
    console.log(`[SERVER] COAZ Simple Chatbot running on port ${config.port}`);
    console.log(`[SERVER] Environment: ${config.nodeEnv}`);

    await initializeSystem();

    console.log('[SERVER] Ready to accept requests');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[SERVER] SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('[SERVER] Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('[SERVER] SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('[SERVER] Process terminated');
    });
});

// Index and consolidate website content (copied from working server.js)
function indexWebsiteContent(allPageData) {
    console.log(`[WEB] 📊 Starting content indexing for ${allPageData.length} pages...`);

    // Initialize consolidated data structures
    const consolidatedData = {
        pages: [],
        globalContact: {
            emails: new Set(),
            phones: new Set(),
            addresses: new Set()
        },
        allContent: [],
        navigation: new Set(),
        headings: [],
        metadata: {
            totalPages: allPageData.length,
            totalContent: 0,
            avgContentPerPage: 0,
            scrapingDate: new Date().toISOString(),
            processingStats: {
                pagesWithContent: 0,
                pagesWithContact: 0,
                pagesWithNavigation: 0,
                totalHeadings: 0
            }
        }
    };

    let totalContentLength = 0;

    // Process each page
    allPageData.forEach((page, index) => {
        console.log(`[WEB] 📋 Processing page ${index + 1}: ${page.title}`);

        // Standardize page data structure
        const standardizedPage = {
            url: page.url,
            title: page.title || 'Untitled',
            description: page.description || '',
            keywords: page.keywords || '',
            content: page.content || [],
            headings: page.headings || [],
            navigation: page.navigation || [],
            contact: page.contact || { emails: [], phones: [], addresses: [] },
            scrapedAt: page.scrapedAt,
            stats: page.stats || {},
            method: page.method || 'unknown'
        };

        consolidatedData.pages.push(standardizedPage);

        // Collect all content
        if (standardizedPage.content && standardizedPage.content.length > 0) {
            consolidatedData.allContent.push(...standardizedPage.content);
            totalContentLength += standardizedPage.content.join(' ').length;
            consolidatedData.metadata.processingStats.pagesWithContent++;
        }

        // Collect global contact information
        if (standardizedPage.contact) {
            if (standardizedPage.contact.emails && standardizedPage.contact.emails.length > 0) {
                standardizedPage.contact.emails.forEach(email => consolidatedData.globalContact.emails.add(email));
                consolidatedData.metadata.processingStats.pagesWithContact++;
            }

            if (standardizedPage.contact.phones && standardizedPage.contact.phones.length > 0) {
                standardizedPage.contact.phones.forEach(phone => consolidatedData.globalContact.phones.add(phone));
            }

            if (standardizedPage.contact.addresses && standardizedPage.contact.addresses.length > 0) {
                standardizedPage.contact.addresses.forEach(address => consolidatedData.globalContact.addresses.add(address));
            }
        }

        // Collect navigation data
        if (standardizedPage.navigation && standardizedPage.navigation.length > 0) {
            standardizedPage.navigation.forEach(navItem => {
                if (navItem.text && navItem.href) {
                    consolidatedData.navigation.add(`${navItem.text}|${navItem.href}`);
                }
            });
            consolidatedData.metadata.processingStats.pagesWithNavigation++;
        }

        // Collect headings
        if (standardizedPage.headings && standardizedPage.headings.length > 0) {
            consolidatedData.headings.push(...standardizedPage.headings);
            consolidatedData.metadata.processingStats.totalHeadings += standardizedPage.headings.length;
        }
    });

    // Convert Sets to Arrays for JSON serialization
    consolidatedData.globalContact.emails = Array.from(consolidatedData.globalContact.emails);
    consolidatedData.globalContact.phones = Array.from(consolidatedData.globalContact.phones);
    consolidatedData.globalContact.addresses = Array.from(consolidatedData.globalContact.addresses);
    consolidatedData.navigation = Array.from(consolidatedData.navigation).map(item => {
        const [text, href] = item.split('|');
        return { text, href };
    });

    // Calculate metadata
    consolidatedData.metadata.totalContent = totalContentLength;
    consolidatedData.metadata.avgContentPerPage = Math.round(totalContentLength / allPageData.length);

    // Log comprehensive results
    console.log(`[WEB] 📊 Website Indexing Complete!`);
    console.log(`[WEB] 📈 Summary Statistics:`);
    console.log(`[WEB]   - Total Pages Processed: ${consolidatedData.metadata.totalPages}`);
    console.log(`[WEB]   - Pages with Content: ${consolidatedData.metadata.processingStats.pagesWithContent}`);
    console.log(`[WEB]   - Pages with Contact Info: ${consolidatedData.metadata.processingStats.pagesWithContact}`);
    console.log(`[WEB]   - Pages with Navigation: ${consolidatedData.metadata.processingStats.pagesWithNavigation}`);
    console.log(`[WEB]   - Total Content Sections: ${consolidatedData.allContent.length}`);
    console.log(`[WEB]   - Total Character Count: ${consolidatedData.metadata.totalContent}`);
    console.log(`[WEB]   - Average Content per Page: ${consolidatedData.metadata.avgContentPerPage} chars`);
    console.log(`[WEB]   - Total Headings: ${consolidatedData.metadata.processingStats.totalHeadings}`);
    console.log(`[WEB]   - Global Emails Found: ${consolidatedData.globalContact.emails.length}`);
    console.log(`[WEB]   - Global Phones Found: ${consolidatedData.globalContact.phones.length}`);
    console.log(`[WEB]   - Global Addresses Found: ${consolidatedData.globalContact.addresses.length}`);
    console.log(`[WEB]   - Navigation Items: ${consolidatedData.navigation.length}`);

    if (consolidatedData.globalContact.emails.length > 0) {
        console.log(`[WEB] 📧 Contact Emails: ${consolidatedData.globalContact.emails.join(', ')}`);
    }

    if (consolidatedData.globalContact.phones.length > 0) {
        console.log(`[WEB] 📞 Contact Phones: ${consolidatedData.globalContact.phones.join(', ')}`);
    }

    return consolidatedData;
}

module.exports = app;
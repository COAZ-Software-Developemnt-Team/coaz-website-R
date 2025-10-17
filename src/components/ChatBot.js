import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaCopy, FaExpand, FaCompress, FaTrash, FaCog, FaBrain, FaSearch } from "react-icons/fa";
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_PRODUCTION_API_URL || "https://coaz.org"
        : process.env.REACT_APP_DEVELOPMENT_API_URL || "http://localhost:8080");

export const sendQuery = async (input, sessionId = null, useRag = true) => {
    try {
        const timeout = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;
        
        const response = await axios.post(
            `${API_BASE_URL}/api/chat`,
            { query: input, sessionId, useRag },
            {
                headers: { "Content-Type": "application/json" },
                timeout: timeout
            }
        );
        return response.data;
    } catch (error) {
        if (process.env.REACT_APP_ENABLE_CONSOLE_LOGS !== 'false') {
            console.error("API Error:", error);
        }
        
        const errorMessage = process.env.REACT_APP_CHATBOT_ERROR_MESSAGE || "Sorry, I couldn't reach the server.";
        return { answer: errorMessage };
    }
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [messages, setMessages] = useState([
        { 
            id: 1,
            sender: "bot", 
            text: process.env.REACT_APP_CHATBOT_WELCOME_MESSAGE || "Hi 👋 I'm your COAZ AI assistant! Ask me anything about the College of Anesthesiologists of Zambia.",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const [useRag, setUseRag] = useState(true); // RAG enabled by default
    const [showSettings, setShowSettings] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize chatbot readiness after a short delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Quick action suggestions tailored for COAZ
    const quickActions = [
        "What is COAZ about?",
        "Tell me about membership",
        "How to join COAZ?",
        "What services does COAZ offer?",
        "Contact information",
        "Training programs"
    ];

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input and scroll to bottom when chat opens
    useEffect(() => {
        if (isOpen) {
            if (inputRef.current) {
                setTimeout(() => inputRef.current?.focus(), 100);
            }
            // Scroll to bottom when chat opens (especially important for loaded messages)
            setTimeout(() => scrollToBottom(), 150);
        }
    }, [isOpen]);

    // Load messages from localStorage on mount
    useEffect(() => {
        if (process.env.REACT_APP_ENABLE_MESSAGE_PERSISTENCE !== 'false') {
            const storageKey = process.env.REACT_APP_SESSION_STORAGE_KEY || 'chatbot-messages';
            const savedMessages = localStorage.getItem(storageKey);
            if (savedMessages) {
                try {
                    const parsedMessages = JSON.parse(savedMessages).map(msg => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }));
                    setMessages(parsedMessages);
                } catch (error) {
                    if (process.env.REACT_APP_ENABLE_CONSOLE_LOGS !== 'false') {
                        console.error('Error loading saved messages:', error);
                    }
                }
            }
        }
    }, []);

    // Save messages to localStorage whenever messages change
    useEffect(() => {
        if (process.env.REACT_APP_ENABLE_MESSAGE_PERSISTENCE !== 'false') {
            const maxHistory = parseInt(process.env.REACT_APP_MAX_MESSAGE_HISTORY) || 100;
            const storageKey = process.env.REACT_APP_SESSION_STORAGE_KEY || 'chatbot-messages';
            
            if (messages.length > 1) { // Don't save just the initial greeting
                // Limit message history to prevent localStorage overflow
                const messagesToSave = messages.slice(-maxHistory);
                localStorage.setItem(storageKey, JSON.stringify(messagesToSave));
            }
        }
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setIsExpanded(false);
        }
    };

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    const copyMessage = (text) => {
        navigator.clipboard.writeText(text.replace(/<[^>]*>/g, ''));
    };

    const formatTimestamp = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleSend = async (message = input) => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: message,
            timestamp: new Date()
        };

        // Add user message
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setIsTyping(true);
        setShowQuickActions(false);

        setInput("");

        try {
            // Simulate typing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const response = await sendQuery(message, sessionId, useRag);
            console.log("Chatbot API response:", response);

            const botMessage = {
                id: Date.now() + 1,
                sender: "bot",
                text: response.text || response.answer || "I couldn't find relevant info in the constitution.",
                timestamp: new Date(),
                responseType: response.responseType,
                ragMetadata: response.ragMetadata
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = {
                id: Date.now() + 1,
                sender: "bot",
                text: `❌ Error: ${err.message}`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
            
            // Refocus the input field after sending message
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    };

    const handleQuickAction = (action) => {
        handleSend(action);
        // Refocus input after quick action
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 200);
    };

    const clearChat = () => {
        const welcomeMessage = process.env.REACT_APP_CHATBOT_WELCOME_MESSAGE || "Hi 👋 I'm your COAZ AI assistant! Ask me anything about the College of Anesthesiologists of Zambia.";
        setMessages([{
            id: 1,
            sender: "bot", 
            text: welcomeMessage,
            timestamp: new Date()
        }]);
        setShowQuickActions(true);
        
        if (process.env.REACT_APP_ENABLE_MESSAGE_PERSISTENCE !== 'false') {
            const storageKey = process.env.REACT_APP_SESSION_STORAGE_KEY || 'chatbot-messages';
            localStorage.removeItem(storageKey);
        }
        
        // Refocus input after clearing chat
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };



    const chatWidth = isExpanded ? "w-96" : "w-80";
    const chatHeight = isExpanded ? "max-h-96" : "max-h-64";

    return (
        <div className="chatbot-global">
            {/* Floating Chat Button - High z-index to appear above all content */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 bg-[rgb(0,175,240)] text-white p-4 rounded-full shadow-2xl z-[9999] transition-all duration-300 hover:bg-[rgb(0,155,220)] hover:scale-110 ${
                    isReady ? 'chatbot-button-pulse' : ''
                } ${isOpen ? 'rotate-90' : ''}`}
                style={{
                    boxShadow: '0 10px 25px rgba(0, 175, 240, 0.3)',
                    zIndex: 9999,
                    opacity: isReady ? 1 : 0.7
                }}
                title="COAZ AI Assistant - Ask me anything about COAZ!"
                aria-label="Open COAZ AI Assistant"
            >
                {isOpen ? <FaTimes size={20} /> : <FaRobot size={24} />}
                
                {/* Ready indicator */}
                {isReady && !isOpen && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
            </button>

            {/* Chat Popup - Highest z-index to appear above all website content */}
            {isOpen && (
                <div className={`fixed bottom-20 right-6 ${chatWidth} bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col z-[9998] animate-slideUpFadeIn`}
                     style={{ zIndex: 9998 }}>
                    {/* Header */}
                    <div className="bg-[rgb(0,175,240)] text-white p-3 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                {useRag ? <FaBrain size={16} /> : <FaSearch size={16} />}
                                <FaRobot size={18} />
                            </div>
                            <div>
                                <span className="font-bold">AI Assistant</span>
                                <div className="text-xs opacity-75">
                                    {useRag ? "RAG Mode" : "Search Mode"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                                title="Settings"
                            >
                                <FaCog size={12} />
                            </button>
                            <button
                                onClick={clearChat}
                                className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                                title="Clear chat"
                            >
                                <FaTrash size={12} />
                            </button>
                            <button
                                onClick={toggleExpanded}
                                className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
                                title={isExpanded ? "Minimize" : "Expand"}
                            >
                                {isExpanded ? <FaCompress size={14} /> : <FaExpand size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    {showSettings && (
                        <div className="bg-gray-100 border-b border-gray-200 p-3">
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700">Response Mode</h4>
                                
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="radio"
                                            name="responseMode"
                                            checked={useRag}
                                            onChange={() => setUseRag(true)}
                                            className="text-[rgb(0,175,240)] focus:ring-[rgb(0,175,240)]"
                                        />
                                        <FaBrain className="text-purple-600" size={14} />
                                        <div>
                                            <span className="font-medium">RAG Mode (Recommended)</span>
                                            <div className="text-xs text-gray-500">
                                                Advanced AI with smart document retrieval
                                            </div>
                                        </div>
                                    </label>
                                    
                                    <label className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="radio"
                                            name="responseMode"
                                            checked={!useRag}
                                            onChange={() => setUseRag(false)}
                                            className="text-[rgb(0,175,240)] focus:ring-[rgb(0,175,240)]"
                                        />
                                        <FaSearch className="text-blue-600" size={14} />
                                        <div>
                                            <span className="font-medium">Search Mode</span>
                                            <div className="text-xs text-gray-500">
                                                Traditional fuzzy search + AI
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                
                                <div className="text-xs text-gray-600 mt-2 p-2 bg-blue-50 rounded">
                                    💡 <strong>RAG Mode</strong> uses specialized QA models for more accurate answers based on document content.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className={`flex-1 p-4 overflow-y-auto ${chatHeight} space-y-3 bg-gray-50 chat-messages`}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
                                <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'} group`}>
                                    <div className={`relative px-4 py-2 rounded-2xl shadow-sm message-bubble ${
                                        msg.sender === 'user' 
                                            ? 'bg-[rgb(0,175,240)] text-white rounded-br-sm' 
                                            : 'bg-white border border-gray-200 rounded-bl-sm'
                                    }`}>
                                        <div 
                                            className="text-sm leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: msg.text }}
                                        />
                                        
                                        {/* RAG Metadata Display */}
                                        {msg.ragMetadata && (
                                            <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <FaBrain size={10} className="text-purple-500" />
                                                    <span>RAG Response</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div>Model: {msg.ragMetadata.model}</div>
                                                    <div>Confidence: {(msg.ragMetadata.confidence * 100).toFixed(1)}%</div>
                                                    <div>Context chunks: {msg.ragMetadata.contextChunks}</div>
                                                    <div>Processing: {msg.ragMetadata.processingTime}ms</div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Response Type Indicator */}
                                        {msg.responseType && msg.sender === 'bot' && (
                                            <div className="mt-1 text-xs text-gray-400">
                                                {msg.responseType === 'rag_qa' && <span className="text-purple-500">🧠 RAG</span>}
                                                {msg.responseType === 'ai_with_constitution' && <span className="text-blue-500">🔍 Search+AI</span>}
                                                {msg.responseType === 'ai_general' && <span className="text-green-500">🤖 AI</span>}
                                                {msg.responseType === 'fallback' && <span className="text-orange-500">📄 Fallback</span>}
                                            </div>
                                        )}
                                        
                                        {msg.sender === 'bot' && process.env.REACT_APP_ENABLE_COPY_MESSAGES !== 'false' && (
                                            <button
                                                onClick={() => copyMessage(msg.text)}
                                                className="absolute top-2 right-2 copy-button hover:bg-gray-100 p-1 rounded transition-all"
                                                title="Copy message"
                                            >
                                                <FaCopy size={10} className="text-gray-400" />
                                            </button>
                                        )}
                                    </div>
                                    {process.env.REACT_APP_ENABLE_TIMESTAMPS !== 'false' && (
                                        <div className={`text-xs text-gray-400 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                            {formatTimestamp(msg.timestamp)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* Quick Actions */}
                        {process.env.REACT_APP_ENABLE_QUICK_ACTIONS !== 'false' && showQuickActions && messages.length <= 1 && !isLoading && (
                            <div className="space-y-2">
                                <div className="text-xs text-gray-500 text-center">Quick questions:</div>
                                <div className="grid grid-cols-1 gap-2">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAction(action)}
                                            className="text-left text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-[rgb(0,175,240)] hover:text-white hover:border-[rgb(0,175,240)] transition-all duration-200 shadow-sm"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Professional Thinking Indicator */}
                        {process.env.REACT_APP_ENABLE_TYPING_INDICATOR !== 'false' && (isLoading || isTyping) && (
                            <div className="flex justify-start animate-fadeInUp">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg rounded-bl-sm px-4 py-3 shadow-md max-w-xs">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-blue-800">
                                                {isLoading ? 'COAZ Assistant is thinking...' : 'Preparing response...'}
                                            </span>
                                            <span className="text-xs text-blue-600">
                                                {isLoading ? 'Searching knowledge base & website content' : 'Formatting information for you'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 w-full bg-blue-200 rounded-full h-1">
                                        <div className="bg-blue-500 h-1 rounded-full animate-pulse transition-all duration-1000" style={{width: isLoading ? '60%' : '90%'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex items-center border-t border-gray-200 p-3 bg-white rounded-b-2xl">
                        <input
                            ref={inputRef}
                            type="text"
                            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(0,175,240)] focus:border-transparent transition-all"
                            placeholder={process.env.REACT_APP_CHATBOT_PLACEHOLDER || "Ask me about COAZ..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isLoading) {
                                    handleSend();
                                    // Keep focus on input after Enter key
                                    e.preventDefault();
                                }
                            }}
                            onBlur={(e) => {
                                // Re-focus if blur was caused by scrolling or clicking in chat area
                                setTimeout(() => {
                                    if (isOpen && !document.activeElement?.closest('button')) {
                                        inputRef.current?.focus();
                                    }
                                }, 10);
                            }}
                            disabled={isLoading}
                            autoFocus={isOpen}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className="ml-3 bg-[rgb(0,175,240)] text-white p-2 rounded-full hover:bg-[rgb(0,155,220)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                        >
                            <FaPaperPlane size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;

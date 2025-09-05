import React, { useState, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi 👋 I’m your assistant! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [knowledgeBase, setKnowledgeBase] = useState({
        "about us": "We are an organization that provides advocacy for the clinicians in Zambia",
        "contact": "Email: info@coaz.com | Phone: +260761234390",
        "services": "We offer Advocacy and Training with our CPD Platform",
        "pricing": "Our pricing varies based on the type of membership package you select",
        "registration": "If you'd like to register, our top right corner has the register button and it'll lead you there!",
        "login": "If you'd like to login, our top right corner has the login button!"
    });

    // Function to generate AI-like responses
    const generateResponse = (question) => {
        const lowerQuestion = question.toLowerCase();

        // Keyword matching for demo purposes
        if (lowerQuestion.includes("about") || lowerQuestion.includes("who")) {
            return knowledgeBase["about us"];
        } else if (lowerQuestion.includes("contact") || lowerQuestion.includes("email")) {
            return knowledgeBase["contact"];
        } else if (lowerQuestion.includes("service") || lowerQuestion.includes("offer")) {
            return knowledgeBase["services"];
        } else if (lowerQuestion.includes("price") || lowerQuestion.includes("cost")) {
            return knowledgeBase["pricing"];
        } else if (lowerQuestion.includes("register") || lowerQuestion.includes("tool")) {
            return knowledgeBase["registration"];
        } else if (lowerQuestion.includes("login") || lowerQuestion.includes("tool")) {
            return knowledgeBase["login"];
        }

        return "I'm sorry, I couldn't find information about that topic. Could you please rephrase your question or ask about something else?";
    };

    const toggleChat = () => setIsOpen(!isOpen);
    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate AI processing
        setTimeout(() => {
            const response = generateResponse(input);
            setMessages(prev => [...prev, { sender: "bot", text: response }]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-[rgb(0,175,240)] text-white p-4 rounded-full shadow-lg z-50"
            >
                {isOpen ? <FaTimes size={20} /> : <FaRobot size={24} />}
            </button>
            {/* Chat Popup */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-80 bg-white shadow-xl rounded-2xl border border-gray-200 flex flex-col z-50">
                    {/* Header */}
                    <div className="bg-[rgb(0,175,240)] text-white p-3 rounded-t-2xl font-bold">
                        AI Assistant
                    </div>
                    {/* Messages */}
                    <div className="flex-1 p-3 overflow-y-auto max-h-64 space-y-2">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded-lg text-sm ${
                                    msg.sender === "user"
                                        ? "bg-[rgb(0,175,240)] text-white self-end ml-auto max-w-[75%]"
                                        : "bg-gray-200 text-gray-900 mr-auto max-w-[75%]"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-center text-gray-500 py-2">
                                Thinking...
                            </div>
                        )}
                    </div>
                    {/* Input */}
                    <div className="flex items-center border-t border-gray-200 p-2">
                        <input
                            type="text"
                            className="flex-1 px-2 py-1 text-sm border rounded-lg focus:outline-none"
                            placeholder="Ask me something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="ml-2 bg-[rgb(0,175,240)] text-white p-2 rounded-lg"
                        >
                            <FaPaperPlane size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
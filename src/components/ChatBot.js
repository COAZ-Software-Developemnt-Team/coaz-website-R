import React, { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from 'axios';

const API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://coaz.org" // Plesk
        : "http://localhost:8080"; // Local dev

export const sendQuery = async (input) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/chat`,
            { query: input },
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        return { answer: "Sorry, I couldn’t reach the server." };
    }
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi 👋 I’m your assistant! Ask me anything." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Call backend to fetch answer from Constitution

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { sender: "user", text: input }]);
        setIsLoading(true);

        try {
            const response = await sendQuery(input);
            console.log("Chatbot API response:", response);

            setMessages(prev => [
                ...prev,
                { sender: "bot", text: response.answer || "I couldn’t find relevant info in the constitution." }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                { sender: "bot", text: `❌ Error: ${err.message}` }
            ]);
        } finally {
            setIsLoading(false);
            setInput("");
        }
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
                                className={`message ${msg.sender}`}
                                dangerouslySetInnerHTML={{ __html: msg.text }}
                            >
                                {/*{msg.sender === "bot" ? (*/}
                                {/*    <span*/}
                                {/*        dangerouslySetInnerHTML={{ __html: msg.text }}*/}
                                {/*    />*/}
                                {/*) : (*/}
                                {/*    msg.text*/}
                                {/*)}*/}
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

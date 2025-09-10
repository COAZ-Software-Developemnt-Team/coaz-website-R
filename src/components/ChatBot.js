import React, { useState } from "react";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi 👋 I’m your assistant! Ask me anything." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Call backend to fetch answer from Constitution
    const generateResponse = async (question) => {
        try {
            const res = await fetch("http://localhost:8080/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();
            return data.answer || "Sorry, I couldn’t find anything in the Constitution about that.";
        } catch (error) {
            console.error("Error fetching from backend:", error);
            return "⚠️ Something went wrong while fetching information.";
        }
    };

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const response = await generateResponse(input);

        setMessages((prev) => [...prev, { sender: "bot", text: response }]);
        setIsLoading(false);
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

import React from 'react';
import ChatBot from './ChatBot';

/**
 * Global ChatBot wrapper component that ensures the chatbot is available
 * on all pages of the website with proper styling and positioning
 */
const ChatBotGlobal = () => {
    return (
        <div 
            className="chatbot-global-wrapper"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999
            }}
        >
            <div style={{ pointerEvents: 'auto' }}>
                <ChatBot />
            </div>
        </div>
    );
};

export default ChatBotGlobal;
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatbotModal from './ChatbotModal';

const FloatingChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-2xl transition-all transform hover:scale-110 z-40 focus:outline-none"
                aria-label="Toggle chatbot"
                title="Chat with INNOVATEX Assistant"
            >
                {isOpen ? (
                    <X size={28} className="animate-spin" />
                ) : (
                    <MessageCircle size={28} />
                )}
            </button>

            {/* Chat Modal */}
            <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

            {/* Badge Animation */}
            {!isOpen && (
                <div className="fixed bottom-24 right-8 bg-white px-3 py-1 rounded-full text-sm text-gray-800 shadow-lg animate-pulse pointer-events-none">
                    💬 Need help?
                </div>
            )}
        </>
    );
};

export default FloatingChatButton;

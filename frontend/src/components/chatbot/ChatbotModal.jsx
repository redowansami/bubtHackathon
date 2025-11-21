import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader, Trash2 } from 'lucide-react';
import chatbotService from '../../services/chatbotService';
import toast from 'react-hot-toast';

const ChatbotModal = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [category, setCategory] = useState('general');
    const [showCategorySelect, setShowCategorySelect] = useState(true);
    const messagesEndRef = useRef(null);

    const categories = [
        {
            id: 'general',
            name: '💬 General Advice',
            description: 'Food & nutrition advice',
            icon: '💬',
        },
        {
            id: 'waste-reduction',
            name: '♻️ Waste Reduction',
            description: 'Reduce food waste',
            icon: '♻️',
        },
        {
            id: 'nutrition',
            name: '🥗 Nutrition',
            description: 'Balanced diet guidance',
            icon: '🥗',
        },
        {
            id: 'budget-meals',
            name: '💰 Budget Meals',
            description: 'Affordable meal planning',
            icon: '💰',
        },
        {
            id: 'leftovers',
            name: '🍳 Leftovers',
            description: 'Transform leftovers',
            icon: '🍳',
        },
        {
            id: 'food-sharing',
            name: '🤝 Food Sharing',
            description: 'Community resources',
            icon: '🤝',
        },
        {
            id: 'environment',
            name: '🌍 Environment',
            description: 'Environmental impact',
            icon: '🌍',
        },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const selectCategory = (categoryId) => {
        setCategory(categoryId);
        setShowCategorySelect(false);
        setMessages([
            {
                role: 'assistant',
                content: `Hello! I'm here to help with ${categories.find((c) => c.id === categoryId)?.name}. What would you like to know?`,
            },
        ]);
        // Generate a new session ID
        const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            let response;

            switch (category) {
                case 'waste-reduction':
                    response = await chatbotService.getWasteReductionAdvice(input, sessionId);
                    break;
                case 'nutrition':
                    response = await chatbotService.getNutritionAdvice(input, sessionId);
                    break;
                case 'budget-meals':
                    response = await chatbotService.getBudgetMealPlan(input, sessionId);
                    break;
                case 'leftovers':
                    response = await chatbotService.getLeftoverIdeas(input, sessionId);
                    break;
                case 'food-sharing':
                    response = await chatbotService.getFoodSharingAdvice(input, sessionId);
                    break;
                case 'environment':
                    response = await chatbotService.getEnvironmentalImpact(input, sessionId);
                    break;
                case 'general':
                default:
                    response = await chatbotService.getGeneralAdvice(input, sessionId);
            }

            const assistantMessage = {
                role: 'assistant',
                content: response.data.data.answer,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // Update session ID if provided by backend
            if (response.data.data.sessionId) {
                setSessionId(response.data.data.sessionId);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to get response');

            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleClearChat = () => {
        if (sessionId) {
            chatbotService
                .clearSession(sessionId)
                .catch((error) => console.error('Error clearing session:', error));
        }
        setMessages([]);
        setShowCategorySelect(true);
        setCategory('general');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end md:items-center md:justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full md:w-96 h-[600px] md:h-[700px] flex flex-col max-w-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex justify-between items-center rounded-t-lg">
                    <div>
                        <h2 className="text-lg font-bold">INNOVATEX Assistant</h2>
                        <p className="text-sm text-green-100">Powered by AI</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-green-700 p-2 rounded transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Category Selection */}
                {showCategorySelect ? (
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-700 mb-4">
                            Choose a topic to get started:
                        </p>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => selectCategory(cat.id)}
                                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-400 transition cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{cat.icon}</span>
                                    <div>
                                        <p className="font-semibold text-gray-800">{cat.name}</p>
                                        <p className="text-xs text-gray-500">{cat.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-xs p-3 rounded-lg ${message.role === 'user'
                                                ? 'bg-green-500 text-white rounded-br-none'
                                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm break-words whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none flex items-center gap-2">
                                        <Loader size={16} className="animate-spin" />
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Section */}
                        <div className="border-t border-gray-200 p-4 space-y-2">
                            <form onSubmit={sendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your question..."
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition"
                                >
                                    <Send size={20} />
                                </button>
                            </form>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowCategorySelect(true)}
                                    className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition"
                                >
                                    Change Topic
                                </button>
                                <button
                                    onClick={handleClearChat}
                                    className="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded transition flex items-center justify-center gap-1"
                                >
                                    <Trash2 size={16} />
                                    Clear
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatbotModal;

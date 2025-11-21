import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingChatButton from '../chatbot/FloatingChatButton';

export const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <Footer />
            <FloatingChatButton />
        </div>
    );
};

export default Layout;

import React from 'react';
import { Leaf } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 border-t border-primary-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="flex items-center gap-2">
                        <Leaf className="text-primary-600" size={24} />
                        <span className="font-bold text-lg">INNOVATEX</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <button className="hover:text-primary-600 transition-colors text-left">
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button className="hover:text-primary-600 transition-colors text-left">
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button className="hover:text-primary-600 transition-colors text-left">
                                    Terms of Service
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Sustainability</h3>
                        <p className="text-sm text-gray-600">
                            Helping reduce food waste and promote responsible consumption for a sustainable future.
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
                    <p>&copy; {currentYear} INNOVATEX. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

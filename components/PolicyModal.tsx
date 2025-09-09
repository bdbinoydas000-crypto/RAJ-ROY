
import React, { useState, useEffect } from 'react';

interface PolicyModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ title, content, onClose }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
            style={{ opacity: isMounted ? 1 : 0 }}
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 transform transition-transform duration-300"
                style={{ transform: isMounted ? 'scale(1)' : 'scale(0.95)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-serif text-purple-400">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <p className="text-gray-300 whitespace-pre-line">{content}</p>
                 <div className="text-right mt-6">
                    <button 
                        onClick={onClose} 
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PolicyModal;

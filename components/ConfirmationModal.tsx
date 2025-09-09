import React, { useState, useEffect } from 'react';

interface ConfirmationModalProps {
    title: string;
    message: React.ReactNode;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onClose, onConfirm }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 p-8 w-full max-w-md m-4 transform transition-all duration-500 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-serif font-bold text-center mb-4">{title}</h2>
                <p className="text-gray-400 text-center mb-8">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;

import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface ConfirmationPageProps {
    navigateTo: (page: 'home') => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ navigateTo }) => {
    const { t } = useLocalization();
    const [referralApplied, setReferralApplied] = useState(false);

    useEffect(() => {
        const applied = sessionStorage.getItem('referralApplied');
        if (applied) {
            setReferralApplied(true);
            sessionStorage.removeItem('referralApplied'); // Clean up
        }
    }, []);

    return (
        <div className="text-center py-20 animate-fade-in-up">
            <div className="inline-block bg-green-500 text-white rounded-full p-4 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-4xl font-serif font-bold text-green-400 mb-4">{t('orderConfirmed')}</h2>
            <p className="text-lg text-gray-300 mb-8">{t('thankYou')}</p>
            
            {referralApplied && (
                <div className="bg-gray-800 border border-purple-500 rounded-lg p-4 max-w-md mx-auto mb-8 animate-fade-in-up">
                    <p className="text-purple-300">✨ {t('referralBonusMessage')}</p>
                </div>
            )}

            <button
                onClick={() => navigateTo('home')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105"
            >
                {t('backToHome')}
            </button>
        </div>
    );
};

export default ConfirmationPage;

import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface OtpModalProps {
    correctOtp: string;
    onClose: () => void;
    onSuccess: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ correctOtp, onClose, onSuccess }) => {
    const { t } = useLocalization();
    const [isMounted, setIsMounted] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        if (e.target.value && index < 3) {
            (e.target.nextElementSibling as HTMLInputElement)?.focus();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.join('') === correctOtp) {
            setError('');
            onSuccess();
        } else {
            setError(t('invalidOtp'));
            setOtp(['', '', '', '']);
            const firstInput = e.currentTarget.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 p-8 w-full max-w-md m-4 transform transition-all duration-500 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('otpVerification')}</h2>
                    <p className="text-gray-400 mt-2">{t('otpSentTo')}</p>
                </div>

                <form onSubmit={handleVerify}>
                    <p className="text-center text-gray-400 mb-4">{t('enterOtp')}</p>
                    <div className="flex justify-center space-x-2 mb-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(e, index)}
                                className="w-12 h-14 bg-gray-700 text-white text-center text-2xl font-bold rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105">
                        {t('verifyAndConfirm')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpModal;

import React, { useState, useEffect } from 'react';

interface AuthModalProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.091 35.638 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);
const FacebookIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" color="#1877F2">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.24h-1.172c-1.227 0-1.636.782-1.636 1.592V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z"></path>
    </svg>
);
const WhatsAppIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" color="#25D366">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.42-1.4c1.4.74 2.97 1.18 4.62 1.18h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.92-9.91zM17.5 14.3c-.28-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.61.14-.18.28-.71.89-.87 1.07-.16.18-.32.2-.59.06-.28-.14-1.17-.43-2.23-1.38-.83-.73-1.39-1.63-1.55-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.37-.02-.51-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.46-.61-.47-.16 0-.34-.02-.52-.02-.18 0-.46.07-.7.35-.25.28-.94.92-.94 2.25s.96 2.61 1.1 2.79c.14.18 1.89 2.9 4.58 4.04.62.26 1.1.42 1.48.53.59.18 1.13.16 1.56.1.48-.07 1.62-.66 1.85-1.29.23-.63.23-1.17.16-1.29-.07-.12-.25-.19-.52-.33z"></path>
    </svg>
);

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [view, setView] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length >= 10) {
            setView('otp');
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        if (e.target.value && index < 3) {
            (e.target.nextElementSibling as HTMLInputElement)?.focus();
        }
    };
    
    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Verifying OTP:", otp.join(''));
        // Mock success, generate token
        const mockToken = btoa(JSON.stringify({ user: phone, type: 'otp' })) + "." + btoa(JSON.stringify({ exp: Date.now() + 86400000 }));
        localStorage.setItem('authToken', mockToken);
        onLoginSuccess();
    };

    const handleSocialLogin = (provider: 'google' | 'facebook') => {
        setIsLoading(provider);
        // Simulate OAuth flow
        setTimeout(() => {
            const mockUser = {
                name: provider === 'google' ? 'Alex Doe' : 'Jane Smith',
                email: provider === 'google' ? 'alex.doe@example.com' : 'jane.smith@example.com',
                provider,
            };
            const header = { alg: 'HS256', typ: 'JWT' };
            const payload = { ...mockUser, exp: Date.now() + 86400000 }; // Expires in 24 hours
            
            const mockToken = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.mockSignature`;

            localStorage.setItem('authToken', mockToken);
            setIsLoading(null);
            onLoginSuccess();
        }, 1500);
    };


    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
            style={{ opacity: isMounted ? 1 : 0 }}
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 p-8 w-full max-w-md m-4 transform transition-all duration-500"
                style={{ transform: isMounted ? 'translateY(0)' : 'translateY(50px)', opacity: isMounted ? 1 : 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Welcome Back</h2>
                    <p className="text-gray-400 mt-2">Sign in to continue your journey.</p>
                </div>

                {view === 'phone' && (
                    <form onSubmit={handleSendOtp} className="animate-fade-in-up">
                        <div className="space-y-4">
                            <input
                                type="tel"
                                placeholder="Enter your mobile number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105">
                                Send OTP
                            </button>
                        </div>
                    </form>
                )}

                {view === 'otp' && (
                     <form onSubmit={handleVerifyOtp} className="animate-fade-in-up">
                        <p className="text-center text-gray-400 mb-4">Enter the OTP sent to {phone}</p>
                        <div className="flex justify-center space-x-2 mb-6">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    className="w-12 h-14 bg-gray-700 text-white text-center text-2xl font-bold rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            ))}
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105">
                            Verify & Login
                        </button>
                    </form>
                )}
                
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-800 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button onClick={() => handleSocialLogin('google')} disabled={!!isLoading} className="w-full flex items-center justify-center bg-gray-700 text-white font-medium py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
                        {isLoading === 'google' ? <Spinner/> : <><GoogleIcon/> Continue with Google</>}
                    </button>
                    <button onClick={() => handleSocialLogin('facebook')} disabled={!!isLoading} className="w-full flex items-center justify-center bg-gray-700 text-white font-medium py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
                       {isLoading === 'facebook' ? <Spinner/> : <><FacebookIcon/> Continue with Facebook</>}
                    </button>
                     <button className="w-full flex items-center justify-center bg-gray-700 text-white font-medium py-3 rounded-lg hover:bg-gray-600 transition-colors">
                       <WhatsAppIcon/> Continue with WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
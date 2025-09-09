import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import type { Order } from '../types';

interface ConfirmationPageProps {
    navigateTo: (page: 'home') => void;
    order: Order | null;
}

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ navigateTo, order }) => {
    const { t } = useLocalization();
    const [referralApplied, setReferralApplied] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const applied = sessionStorage.getItem('referralApplied');
        if (applied) {
            setReferralApplied(true);
            sessionStorage.removeItem('referralApplied'); // Clean up
        }

        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = parseJwt(token);
            if (decoded && decoded.name) {
                setUserName(decoded.name.split(' ')[0]); // Get first name
            }
        }
    }, []);

    const greetingHeader = (
        <h2 className="text-4xl font-serif font-bold text-green-400 mb-4">
            {userName ? t('greetingPersonalized').replace('{name}', userName) : t('orderConfirmed')}
        </h2>
    );

    if (!order) {
        // Fallback for when order data is not available
        return (
            <div className="text-center py-20 animate-fade-in-up">
                <div className="inline-block bg-green-500 text-white rounded-full p-4 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                {greetingHeader}
                <p className="text-lg text-gray-300 mb-8">{t('thankYou')}</p>
                <button
                    onClick={() => navigateTo('home')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105"
                >
                    {t('backToHome')}
                </button>
            </div>
        );
    }
    
    const estimatedDelivery = new Date(order.date);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    return (
        <div className="max-w-3xl mx-auto py-12 animate-fade-in-up">
            <div className="text-center mb-10">
                <div className="inline-block bg-green-500 text-white rounded-full p-4 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                {greetingHeader}
                <p className="text-lg text-gray-300">{t('thankYou')}</p>
            </div>

            <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-serif mb-6 border-b border-gray-700 pb-4">Order Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {order.shippingAddress && (
                         <div>
                            <h4 className="font-semibold text-lg text-gray-300 mb-2">Shipping To</h4>
                            <div className="text-gray-400 space-y-1">
                                <p className="font-bold text-gray-200">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                            </div>
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-lg text-gray-300 mb-2">Order Details</h4>
                        <div className="text-gray-400 space-y-1">
                             <p><strong>Order ID:</strong> {order.id}</p>
                             <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                             <p><strong>Est. Delivery:</strong> {estimatedDelivery.toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <h4 className="font-semibold text-lg text-gray-300 mb-3">Items Purchased</h4>
                <div className="space-y-4 mb-6">
                    {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md">
                            <div className="flex items-center">
                                <img src={item.customization?.imageUrl || item.variation?.imageUrl || item.product.imageUrl} alt={t(item.product.nameKey)} className="w-16 h-16 object-cover rounded-md mr-4" />
                                <div>
                                    <p className="font-semibold">{t(item.product.nameKey)}{item.variation ? ` - ${t(item.variation.nameKey)}` : ''}</p>
                                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <span className="font-semibold">₹{((item.variation ? item.variation.price : item.product.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></div>
                    {order.discount !== undefined && order.discount > 0 && (
                        <div className="flex justify-between text-green-400">
                            <span>Discount</span>
                            <span>-₹{order.discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-300"><span>Shipping</span><span>₹{order.shipping?.toFixed(2)}</span></div>
                    <hr className="my-2 border-gray-600" />
                    <div className="flex justify-between font-bold text-xl"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
                </div>
            </div>
            
            {referralApplied && (
                <div className="bg-gray-800 border border-purple-500 rounded-lg p-4 max-w-md mx-auto my-8 animate-fade-in-up">
                    <p className="text-purple-300 text-center">✨ {t('referralBonusMessage')}</p>
                </div>
            )}

            <div className="text-center mt-10">
                <button
                    onClick={() => navigateTo('home')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105"
                >
                    {t('backToHome')}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPage;
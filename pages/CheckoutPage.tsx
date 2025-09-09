
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLocalization } from '../context/LocalizationContext';
import { useReward } from '../context/RewardContext';
import OtpModal from '../components/OtpModal';
import type { Order } from '../types';

interface CheckoutPageProps {
    navigateTo: (page: 'home' | 'product' | 'confirmation') => void;
    onOrderConfirmed: (order: Order) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigateTo, onOrderConfirmed }) => {
    const { cartItems, clearCart } = useCart();
    const { t } = useLocalization();
    const { addPoints } = useReward();

    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('creditDebitCard');

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.variation ? item.variation.price : item.product.price;
        return sum + price * item.quantity;
    }, 0);
    const shipping = 50;
    const total = subtotal + shipping - discountAmount;

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(otp);
        
        const otpEmailContent = `
--- Mock Email ---
To: ${email}
From: GiftScape Studio <no-reply@giftscape.studio>
Subject: Your One-Time Password (OTP)

Hello,

Your OTP for order confirmation is: ${otp}

This code will expire in 10 minutes.

Thank you,
GiftScape Studio Team
        `;
        alert(otpEmailContent);
        
        setShowOtpModal(true);
    };
    
    const handleOrderConfirmation = () => {
        const newOrder: Order = {
            id: `GSS-${Math.floor(10000 + Math.random() * 90000)}`,
            date: new Date().toISOString(),
            status: 'Processing',
            items: cartItems,
            subtotal: subtotal,
            shipping: shipping,
            discount: discountAmount,
            total: total,
            shippingAddress: {
                fullName,
                email,
                phone,
                address,
                city,
                pincode,
            },
        };

        const confirmationEmailContent = `
--- Mock Email ---
To: ${email}
From: GiftScape Studio <orders@giftscape.studio>
Subject: Your GiftScape Studio Order #${newOrder.id} is Confirmed!

Hello,

Thank you for your purchase! Your order has been successfully placed.

Order ID: ${newOrder.id}
Total Amount: ₹${total.toFixed(2)}

We will notify you again once your order has shipped.

Thank you,
GiftScape Studio Team
        `;
        alert(confirmationEmailContent);

        const refIdEncoded = sessionStorage.getItem('referralId');
        if (refIdEncoded) {
            try {
                const referrerId = atob(refIdEncoded);
                addPoints(50, referrerId); // Award 50 points to the referrer
                sessionStorage.removeItem('referralId');
                sessionStorage.setItem('referralApplied', 'true');
            } catch (e) {
                console.error("Could not process referral ID:", e);
            }
        }
        setShowOtpModal(false);
        clearCart();
        onOrderConfirmed(newOrder);
    };

    const handleApplyDiscount = () => {
        if (discountCode.trim() !== '' && discountAmount === 0) {
            const calculatedDiscount = subtotal * 0.10;
            setDiscountAmount(calculatedDiscount);
        }
    };

    const paymentMethods = ['creditDebitCard', 'upi', 'netBanking', 'wallets', 'cod'];

    return (
        <>
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <h2 className="text-4xl font-serif font-bold text-center mb-8">{t('checkout')}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shipping and Payment */}
                    <form onSubmit={handlePlaceOrder} className="space-y-6 bg-gray-800 p-8 rounded-lg">
                        <div>
                            <h3 className="text-2xl font-serif mb-4">{t('shippingAddress')}</h3>
                            <div className="space-y-4">
                                <input type="text" placeholder={t('fullName')} value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-gray-700 p-3 rounded" required />
                                <input type="email" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-700 p-3 rounded" required />
                                <input type="tel" placeholder={t('whatsappNumber')} value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-700 p-3 rounded" required />
                                <input type="text" placeholder={t('address')} value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-700 p-3 rounded" required />
                                <div className="flex space-x-4">
                                    <input type="text" placeholder={t('city')} value={city} onChange={e => setCity(e.target.value)} className="w-full bg-gray-700 p-3 rounded" required />
                                    <input type="text" placeholder={t('pincode')} value={pincode} onChange={e => setPincode(e.target.value)} className="w-full bg-gray-700 p-3 rounded" required />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif mb-4">{t('paymentMethod')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {paymentMethods.map(method => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => setSelectedPayment(method)}
                                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                                            selectedPayment === method
                                            ? 'border-purple-500 bg-purple-900/50 scale-105'
                                            : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                        }`}
                                    >
                                        <span className="font-semibold">{t(method)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                            {t('placeOrder')}
                        </button>
                    </form>

                    {/* Order Summary */}
                    <div className="bg-gray-800 p-8 rounded-lg flex flex-col space-y-4">
                        <h3 className="text-2xl font-serif">Order Summary</h3>
                        <div className="space-y-3 flex-grow">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-gray-300">
                                    <span className="truncate pr-4">
                                        {t(item.product.nameKey)}
                                        {item.variation && ` - ${t(item.variation.nameKey)}`} x{item.quantity}
                                    </span>
                                    <span>₹{((item.variation ? item.variation.price : item.product.price) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div>
                            <label htmlFor="discount-code" className="block text-sm font-medium text-gray-400 mb-2">{t('discountCode')}</label>
                            <div className="flex space-x-2">
                                <input
                                    id="discount-code"
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="w-full bg-gray-700 p-2 rounded disabled:opacity-50"
                                    disabled={discountAmount > 0}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyDiscount}
                                    className="bg-purple-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                                    disabled={discountAmount > 0 || discountCode.trim() === ''}
                                >
                                    {t('apply')}
                                </button>
                            </div>
                        </div>

                        <hr className="border-gray-700" />
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>{t('discount')} (10%)</span>
                                    <span>-₹{discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between"><span>Shipping</span><span>₹{shipping.toFixed(2)}</span></div>
                            <hr className="my-2 border-gray-700" />
                            <div className="flex justify-between font-bold text-xl"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            {showOtpModal && (
                <OtpModal
                    correctOtp={generatedOtp}
                    onClose={() => setShowOtpModal(false)}
                    onSuccess={handleOrderConfirmation}
                />
            )}
        </>
    );
};

export default CheckoutPage;
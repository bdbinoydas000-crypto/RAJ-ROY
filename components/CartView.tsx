import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLocalization } from '../context/LocalizationContext';

interface CartViewProps {
    onClose: () => void;
    onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ onClose, onCheckout }) => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const { t } = useLocalization();
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.variation ? item.variation.price : item.product.price;
        return sum + price * item.quantity;
    }, 0);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 500); // Duration should match animation duration
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/60 z-50 ${isMounted && !isClosing ? 'animate-fade-in' : 'animate-fade-out'}`} 
            onClick={handleClose}
        >
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-800 shadow-2xl flex flex-col ${isMounted && !isClosing ? 'animate-slide-in-right' : 'animate-slide-out-right'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-serif font-bold text-purple-400">{t('shoppingCart')}</h2>
                        {cartItemCount > 0 && (
                            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {cartItemCount} {cartItemCount > 1 ? 'items' : 'item'}
                            </span>
                        )}
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-500">{t('emptyCart')}</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center mb-4">
                                <img src={item.customization?.imageUrl || item.variation?.imageUrl || item.product.imageUrl} alt={t(item.product.nameKey)} className="w-20 h-20 object-cover rounded-md mr-4" />
                                <div className="flex-grow">
                                    <h3 className="font-bold">
                                        {t(item.product.nameKey)}
                                        {item.variation && <span className="text-gray-300 font-normal"> - {t(item.variation.nameKey)}</span>}
                                    </h3>
                                    <p className="text-sm text-gray-400">₹{item.variation ? item.variation.price : item.product.price}</p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                        className="w-12 text-center bg-gray-700 rounded"
                                    />
                                    <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-400">
                                        &#x1F5D1;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {cartItems.length > 0 && (
                     <div className="p-4 border-t border-gray-700">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={onCheckout}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105"
                        >
                            {t('checkout')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartView;
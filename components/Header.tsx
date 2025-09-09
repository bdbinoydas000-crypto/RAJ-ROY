import React, { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReward } from '../context/RewardContext';
import CartView from './CartView';
import WishlistView from './WishlistView';
import type { WishlistItem } from '../types';
import type { Page } from '../App';

interface HeaderProps {
    onAuthClick: () => void;
    navigateTo: (page: Page) => void;
    onLoadFromWishlist: (item: WishlistItem) => void;
    isAuthenticated: boolean;
    onLogout: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onAuthClick, 
    navigateTo, 
    onLoadFromWishlist, 
    isAuthenticated, 
    onLogout,
    searchQuery,
    onSearchChange
}) => {
    const { language, setLanguage, t } = useLocalization();
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const { rewardPoints } = useReward();
    const [isCartOpen, setCartOpen] = useState(false);
    const [isWishlistOpen, setWishlistOpen] = useState(false);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'bn' : 'en');
    };

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistItemCount = wishlistItems.length;

    const handleCheckout = () => {
        setCartOpen(false);
        navigateTo('checkout');
    }

    const handleLoadDesign = (item: WishlistItem) => {
        setWishlistOpen(false);
        onLoadFromWishlist(item);
    }

    return (
        <header className="bg-gray-800/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-700">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
                <h1 
                    onClick={() => navigateTo('home')}
                    className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 cursor-pointer flex-shrink-0"
                >
                    {t('appName')}
                </h1>
                
                {/* Search Bar */}
                <div className="relative flex-grow max-w-xl mx-4 hidden md:block">
                    <input 
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-full px-5 py-2 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                     <div className="absolute top-0 right-0 h-full flex items-center pr-4 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <nav className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                    <button onClick={toggleLanguage} className="hidden md:block text-sm font-medium hover:text-purple-400 transition-colors">
                        {language === 'en' ? 'বাংলা' : 'English'}
                    </button>
                    {isAuthenticated ? (
                         <>
                            <button onClick={() => navigateTo('profile')} className="hover:text-purple-400 transition-colors" title={t('myProfile')}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </button>
                             <div className="flex items-center space-x-1 text-amber-500" title={`${rewardPoints} ${t('rewardPoints')}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="hidden lg:inline font-bold">{rewardPoints}</span>
                            </div>
                         </>
                    ) : (
                        <button onClick={onAuthClick} className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                            {t('loginSignUp')}
                        </button>
                    )}
                    
                    <button onClick={() => setWishlistOpen(true)} className="relative hover:text-purple-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        {wishlistItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistItemCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setCartOpen(true)} className="relative hover:text-purple-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                     {isAuthenticated && (
                         <button onClick={onLogout} className="text-sm font-medium hover:text-purple-400 transition-colors hidden md:block">
                            {t('logout')}
                        </button>
                    )}
                </nav>
            </div>
            {isCartOpen && <CartView onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />}
            {isWishlistOpen && <WishlistView onClose={() => setWishlistOpen(false)} onLoadDesign={handleLoadDesign} />}
        </header>
    );
};

export default Header;
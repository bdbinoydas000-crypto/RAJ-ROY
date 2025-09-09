
import React, { useState, useCallback, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { LocalizationProvider } from './context/LocalizationContext';
import { WishlistProvider } from './context/WishlistContext';
import { RewardProvider } from './context/RewardContext';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import type { Product, WishlistItem, CustomizationState, Order } from './types';

export type Page = 'home' | 'product' | 'checkout' | 'confirmation' | 'profile';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [initialCustomization, setInitialCustomization] = useState<CustomizationState | null>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [lastOrder, setLastOrder] = useState<Order | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const refId = urlParams.get('ref');
        if (refId) {
            sessionStorage.setItem('referralId', refId);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const navigateTo = useCallback((page: Page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    }, []);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        if (currentPage !== 'home') {
            navigateTo('home');
        }
    }, [currentPage, navigateTo]);

    const handleProductSelect = useCallback((product: Product) => {
        setSelectedProduct(product);
        setInitialCustomization(null);
        setSearchQuery(''); 
        navigateTo('product');
    }, [navigateTo]);

    const handleLoadFromWishlist = useCallback((item: WishlistItem) => {
        setSelectedProduct(item.product);
        setInitialCustomization(item.customization);
        setSearchQuery('');
        navigateTo('product');
    }, [navigateTo]);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setAuthModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setSearchQuery('');
        navigateTo('home');
    };

    const handleOrderConfirmed = (order: Order) => {
        setLastOrder(order);
        navigateTo('confirmation');
    };
    
    const renderPage = () => {
        switch (currentPage) {
            case 'product':
                return selectedProduct ? <ProductPage product={selectedProduct} navigateTo={navigateTo} initialCustomization={initialCustomization} isAuthenticated={isAuthenticated} /> : <HomePage onProductSelect={handleProductSelect} searchQuery={searchQuery} navigateTo={navigateTo} />;
            case 'checkout':
                return <CheckoutPage navigateTo={navigateTo} onOrderConfirmed={handleOrderConfirmed} />;
            case 'confirmation':
                return <ConfirmationPage navigateTo={navigateTo} order={lastOrder} />;
            case 'profile':
                return <ProfilePage />;
            case 'home':
            default:
                return <HomePage onProductSelect={handleProductSelect} searchQuery={searchQuery} navigateTo={navigateTo} />;
        }
    };

    return (
        <LocalizationProvider>
            <CartProvider>
                <WishlistProvider>
                    <RewardProvider>
                        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-300 font-sans">
                            <Header 
                                onAuthClick={() => setAuthModalOpen(true)} 
                                navigateTo={navigateTo}
                                onLoadFromWishlist={handleLoadFromWishlist}
                                isAuthenticated={isAuthenticated}
                                onLogout={handleLogout}
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                            />
                            <main className="flex-grow container mx-auto px-4 py-8">
                                {renderPage()}
                            </main>
                            <Footer />
                            {isAuthModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
                        </div>
                    </RewardProvider>
                </WishlistProvider>
            </CartProvider>
        </LocalizationProvider>
    );
};

export default App;

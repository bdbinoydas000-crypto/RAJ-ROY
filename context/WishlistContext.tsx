import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { WishlistItem, Product, CustomizationState } from '../types';

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (product: Product, customization: CustomizationState) => void;
    removeFromWishlist: (itemId: string) => void;
    isItemInWishlist: (product: Product, customization: CustomizationState) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'giftscape_wishlist';

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

    useEffect(() => {
        try {
            const storedItems = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (storedItems) {
                setWishlistItems(JSON.parse(storedItems));
            }
        } catch (error) {
            console.error("Could not load wishlist from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
        } catch (error) {
            console.error("Could not save wishlist to localStorage", error);
        }
    }, [wishlistItems]);

    const addToWishlist = (product: Product, customization: CustomizationState) => {
        const newItem: WishlistItem = {
            id: Date.now().toString(),
            product,
            customization,
        };
        setWishlistItems(prevItems => [...prevItems, newItem]);
    };

    const removeFromWishlist = (itemId: string) => {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const isItemInWishlist = (product: Product, customization: CustomizationState): boolean => {
         // A simple JSON.stringify check to see if an identical customization exists.
         // This could be more sophisticated if needed.
         const customString = JSON.stringify(customization);
         return wishlistItems.some(item => 
            item.product.id === product.id && 
            JSON.stringify(item.customization) === customString
         );
    }

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isItemInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

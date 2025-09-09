import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { CartItem, Product, ProductVariation } from '../types';

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity: number, customization?: CartItem['customization'], variation?: ProductVariation) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, quantity: number, customization?: CartItem['customization'], variation?: ProductVariation) => {
        const cartItemId = `${product.id}-${variation?.id || 'default'}`;
        
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === cartItemId);
            
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity + quantity, customization }
                        : item
                );
            }
            
            const newItem: CartItem = {
                id: cartItemId,
                product,
                quantity,
                customization,
                variation
            };
            return [...prevItems, newItem];
        });
    };

    const removeFromCart = (cartItemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === cartItemId ? { ...item, quantity } : item
            ).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
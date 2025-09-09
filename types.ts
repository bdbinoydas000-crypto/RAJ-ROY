
export interface ProductVariation {
    id: string;
    nameKey: string;
    price: number;
    imageUrl: string;
}

export interface Review {
    id: string;
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Product {
    id:string;
    nameKey: string;
    descriptionKey: string;
    price: number;
    imageUrl: string;
    categoryKey: string;
    customizable: boolean;
    variations?: ProductVariation[];
    averageRating?: number;
    reviewCount?: number;
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    variation?: ProductVariation;
    customization?: {
        imageUrl: string;
        text: string;
    };
}

export interface FilterState {
    brightness: number;
    contrast: number;
    sepia: number;
    grayscale: number;
    blur: number;
    vignette: number;
    sharpen: number;
}

export interface CustomizationState {
    originalImageSrc: string;
    imageMime: string;
    text: string;
    font: string;
    color: string;
    filters: FilterState;
}

export interface WishlistItem {
    id: string; // unique id for each wishlist item, e.g., timestamp
    product: Product;
    customization: CustomizationState;
}

export interface CarouselSlide {
    id: string;
    imageUrl: string;
    titleKey: string;
    subtitleKey: string;
    ctaKey: string;
    ctaLink: string;
}

export type Language = 'en' | 'bn';

export interface Translations {
    [key: string]: {
        [lang in Language]: string;
    };
}

export interface RewardContextType {
    rewardPoints: number;
    addPoints: (points: number, forUserId?: string) => void;
}

export interface Address {
    id: string;
    type: 'Home' | 'Work';
    line1: string;
    city: string;
    pincode: string;
    isDefault: boolean;
}

export type OrderStatus = 'Delivered' | 'Processing' | 'Cancelled' | 'Shipped' | 'Out for Delivery';

export interface ShippingInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
}

export interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    total: number;
    items: CartItem[];
    subtotal?: number;
    shipping?: number;
    discount?: number;
    trackingId?: string;
    shippingProvider?: string;
    shippingAddress?: ShippingInfo;
}
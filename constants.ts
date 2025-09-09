import type { Product, Translations, Order, Address } from './types';

export const PRODUCTS: Product[] = [
    { 
        id: 'p1', 
        nameKey: 'glowFrame', 
        descriptionKey: 'glowFrameDesc', 
        price: 1299, 
        imageUrl: 'https://picsum.photos/seed/glowframe-s/600/600', 
        categoryKey: 'anniversaryGifts', 
        customizable: true,
        variations: [
            { id: 'p1-s', nameKey: 'glowFrameSmall', price: 1299, imageUrl: 'https://picsum.photos/seed/glowframe-s/600/600' },
            { id: 'p1-m', nameKey: 'glowFrameMedium', price: 1599, imageUrl: 'https://picsum.photos/seed/glowframe-m/600/600' },
            { id: 'p1-l', nameKey: 'glowFrameLarge', price: 1999, imageUrl: 'https://picsum.photos/seed/glowframe-l/600/600' },
        ]
    },
    { id: 'p2', nameKey: 'photoRestore', descriptionKey: 'photoRestoreDesc', price: 899, imageUrl: 'https://picsum.photos/seed/photorestore/600/600', categoryKey: 'oldPhotos', customizable: true },
    { id: 'p3', nameKey: 'customPrint', descriptionKey: 'customPrintDesc', price: 499, imageUrl: 'https://picsum.photos/seed/customprint/600/600', categoryKey: 'customPrints', customizable: true },
    { id: 'p4', nameKey: 'birthdayMug', descriptionKey: 'birthdayMugDesc', price: 399, imageUrl: 'https://picsum.photos/seed/birthdaymug/600/600', categoryKey: 'birthdayGifts', customizable: true },
    { id: 'p5', nameKey: 'loveCushion', descriptionKey: 'loveCushionDesc', price: 799, imageUrl: 'https://picsum.photos/seed/lovecushion/600/600', categoryKey: 'loveGifts', customizable: true },
    { id: 'p6', nameKey: 'passportPhotos', descriptionKey: 'passportPhotosDesc', price: 199, imageUrl: 'https://picsum.photos/seed/passport/600/600', categoryKey: 'photoServices', customizable: false },
];

export const CATEGORIES = {
    birthdayGifts: { nameKey: 'birthdayGifts' },
    loveGifts: { nameKey: 'loveGifts' },
    anniversaryGifts: { nameKey: 'anniversaryGifts' },
    photoServices: { nameKey: 'photoServices' },
    customPrints: { nameKey: 'customPrints' },
    oldPhotos: { nameKey: 'oldPhotos' },
};

// MOCK DATA FOR PROFILE PAGE
export const MOCK_ORDERS: Order[] = [
    {
        id: '#GSS-84632',
        date: '2023-10-26',
        status: 'Delivered',
        total: 1999,
        items: [
            {
                id: 'p1-p1-l',
                product: PRODUCTS.find(p => p.id === 'p1')!,
                variation: PRODUCTS.find(p => p.id === 'p1')?.variations?.find(v => v.id === 'p1-l'),
                quantity: 1,
                customization: { imageUrl: 'https://picsum.photos/seed/order1/200/200', text: 'Our Anniversary' }
            }
        ]
    },
    {
        id: '#GSS-75190',
        date: '2023-09-15',
        status: 'Delivered',
        total: 1297,
        items: [
             {
                id: 'p2-default',
                product: PRODUCTS.find(p => p.id === 'p2')!,
                quantity: 1,
                customization: { imageUrl: 'https://picsum.photos/seed/order2/200/200', text: '' }
            },
            {
                id: 'p6-default',
                product: PRODUCTS.find(p => p.id === 'p6')!,
                quantity: 2
            }
        ]
    },
     {
        id: '#GSS-69341',
        date: '2024-01-05',
        status: 'Processing',
        total: 799,
        items: [
             {
                id: 'p5-default',
                product: PRODUCTS.find(p => p.id === 'p5')!,
                quantity: 1,
                customization: { imageUrl: 'https://picsum.photos/seed/order3/200/200', text: 'My Love' }
            }
        ]
    }
];

export const MOCK_ADDRESSES: Address[] = [
    {
        id: 'addr1',
        type: 'Home',
        line1: '42, Sunset Boulevard',
        city: 'Kolkata',
        pincode: '700028',
        isDefault: true,
    },
    {
        id: 'addr2',
        type: 'Work',
        line1: '1 Tech Park, Silicon Valley',
        city: 'Bengaluru',
        pincode: '560100',
        isDefault: false,
    }
];


export const translations: Translations = {
    // General
    appName: { en: "GiftScape Studio", bn: "গিফটস্কেপ স্টুডিও" },
    home: { en: "Home", bn: "হোম" },
    loginSignUp: { en: "Login / Sign Up", bn: "লগইন / সাইন আপ" },
    logout: { en: "Logout", bn: "লগআউট" },
    addToCart: { en: "Add to Cart", bn: "কার্টে যোগ করুন" },
    allRightsReserved: { en: "All Rights Reserved", bn: "সর্বস্বত্ব সংরক্ষিত" },
    searchPlaceholder: { en: "Search for products...", bn: "পণ্য খুঁজুন..." },
    noResults: { en: "No products found for your search.", bn: "আপনার অনুসন্ধানের জন্য কোন পণ্য পাওয়া যায়নি।" },
    
    // Categories
    birthdayGifts: { en: "Birthday Gifts", bn: "জন্মদিনের উপহার" },
    loveGifts: { en: "Love Gifts", bn: "প্রেমের উপহার" },
    anniversaryGifts: { en: "Anniversary Gifts", bn: "বার্ষিকী উপহার" },
    photoServices: { en: "Passport Size Photos", bn: "পাসপোর্ট সাইজের ছবি" },
    customPrints: { en: "Custom Size Prints", bn: "কাস্টম সাইজ প্রিন্ট" },
    oldPhotos: { en: "Old Photo Restoration", bn: "পুরানো ছবি পুনরুদ্ধার" },
    
    // Products
    glowFrame: { en: "Glow Photo Frame", bn: "গ্লো ফটো ফ্রেম" },
    glowFrameDesc: { en: "A magical frame that illuminates your cherished memories.", bn: "একটি জাদুকরী ফ্রেম যা আপনার প্রিয় স্মৃতিগুলিকে আলোকিত করে।" },
    photoRestore: { en: "AI Photo Restoration", bn: "এআই ছবি পুনরুদ্ধার" },
    photoRestoreDesc: { en: "Bring your old, damaged photos back to life with AI.", bn: "এআই দিয়ে আপনার পুরানো, ক্ষতিগ্রস্ত ছবিগুলিকে প্রাণবন্ত করে তুলুন।" },
    customPrint: { en: "Custom Photo Print", bn: "কাস্টম ফটো প্রিন্ট" },
    customPrintDesc: { en: "High-quality prints of your favorite photos in any size.", bn: "আপনার প্রিয় ছবির উচ্চ-মানের প্রিন্ট যেকোনো আকারে।" },
    birthdayMug: { en: "Personalized Birthday Mug", bn: "ব্যক্তিগতকৃত জন্মদিনের মগ" },
    birthdayMugDesc: { en: "Start their day with a smile and a personalized mug.", bn: "একটি ব্যক্তিগতকৃত মগ দিয়ে তাদের দিন শুরু করুন।" },
    loveCushion: { en: "Romantic Photo Cushion", bn: "রোমান্টিক ফটো কুশন" },
    loveCushionDesc: { en: "A cozy and romantic gift for your special someone.", bn: "আপনার বিশেষ কারো জন্য একটি আরামদায়ক এবং রোমান্টিক উপহার।" },
    passportPhotos: { en: "Passport Photo Set", bn: "পাসপোর্ট ছবির সেট" },
    passportPhotosDesc: { en: "Official standard passport photos, printed and delivered.", bn: "অফিসিয়াল স্ট্যান্ডার্ড পাসপোর্ট ছবি, প্রিন্ট এবং ডেলিভারি।" },

    // Variations
    glowFrameSmall: { en: "Small (8x10)", bn: "ছোট (৮x১০)" },
    glowFrameMedium: { en: "Medium (12x16)", bn: "মাঝারি (১২x১৬)" },
    glowFrameLarge: { en: "Large (16x20)", bn: "বড় (১৬x২০)" },

    // Customizer
    customizeYour: { en: "Customize Your", bn: "আপনার কাস্টমাইজ করুন" },
    uploadPhoto: { en: "Upload Photo", bn: "ছবি আপলোড করুন" },
    changePhoto: { en: "Change Photo", bn: "ছবি পরিবর্তন করুন" },
    restoreWithAI: { en: "Restore with AI", bn: "AI দিয়ে পুনরুদ্ধার করুন" },
    restoring: { en: "Restoring...", bn: "পুনরুদ্ধার করা হচ্ছে..." },
    addText: { en: "Add Text", bn: "টেক্সট যোগ করুন" },
    enterText: { en: "Enter your text", bn: "আপনার টেক্সট লিখুন" },
    fontStyle: { en: "Font Style", bn: "ফন্ট স্টাইল" },
    textColor: { en: "Text Color", bn: "টেক্সট এর রঙ" },
    saveToWishlist: { en: "Save to Wishlist", bn: "উইশলিস্টে সেভ করুন" },
    saved: { en: "Saved!", bn: "সেভ হয়েছে!" },
    selectSize: { en: "Select Size", bn: "সাইজ নির্বাচন করুন"},
    
    // Checkout
    checkout: { en: "Checkout", bn: "চেকআউট" },
    shippingAddress: { en: "Shipping Address", bn: "শিপিং ঠিকানা" },
    fullName: { en: "Full Name", bn: "পুরো নাম" },
    address: { en: "Address", bn: "ঠিকানা" },
    city: { en: "City", bn: "শহর" },
    pincode: { en: "Pincode", bn: "পিনকোড" },
    email: { en: "Email", bn: "ইমেল" },
    whatsappNumber: { en: "WhatsApp Number", bn: "হোয়াটসঅ্যাপ নম্বর" },
    paymentMethod: { en: "Payment Method", bn: "পেমেন্ট পদ্ধতি" },
    placeOrder: { en: "Place Order", bn: "অর্ডার দিন" },
    discountCode: { en: "Discount Code", bn: "ডিসকাউন্ট কোড" },
    apply: { en: "Apply", bn: "প্রয়োগ করুন" },
    discount: { en: "Discount", bn: "ছাড়" },
    creditDebitCard: { en: "Credit/Debit Card", bn: "ক্রেডিট/ডেবিট কার্ড" },
    upi: { en: "UPI", bn: "ইউপিআই" },
    netBanking: { en: "Net Banking", bn: "নেট ব্যাংকিং" },
    wallets: { en: "Wallets", bn: "ওয়ালেট" },
    cod: { en: "Cash on Delivery", bn: "ক্যাশ অন ডেলিভারি" },
    
    // Cart
    shoppingCart: { en: "Shopping Cart", bn: "শপিং কার্ট" },
    emptyCart: { en: "Your cart is empty.", bn: "আপনার কার্ট খালি।" },

    // Wishlist
    wishlist: { en: "Wishlist", bn: "উইশলিস্ট" },
    savedDesigns: { en: "Saved Designs", bn: "সেভ করা ডিজাইন" },
    emptyWishlist: { en: "Your wishlist is empty.", bn: "আপনার উইশলিস্ট খালি।" },
    loadDesign: { en: "Load Design", bn: "ডিজাইন লোড করুন" },
    
    // Confirmation
    orderConfirmed: { en: "Order Confirmed!", bn: "অর্ডার নিশ্চিত হয়েছে!" },
    thankYou: { en: "Thank you for your purchase.", bn: "আপনার কেনার জন্য ধন্যবাদ।" },
    backToHome: { en: "Back to Home", bn: "হোমে ফিরে যান" },

    // OTP Modal
    otpVerification: { en: "OTP Verification", bn: "ওটিপি যাচাইকরণ" },
    otpSentTo: { en: "An OTP has been sent to your Email and WhatsApp.", bn: "আপনার ইমেল এবং হোয়াটসঅ্যাপে একটি ওটিপি পাঠানো হয়েছে।" },
    enterOtp: { en: "Enter OTP", bn: "ওটিপি প্রবেশ করান" },
    verifyAndConfirm: { en: "Verify & Confirm Order", bn: "যাচাই করুন এবং অর্ডার নিশ্চিত করুন" },
    invalidOtp: { en: "Invalid OTP. Please try again.", bn: "অবৈধ ওটিপি। আবার চেষ্টা করুন।" },
    
    // Share & Reward
    shareAndEarn: { en: "Share & Earn", bn: "শেয়ার এবং উপার্জন" },
    sharePrompt: { en: "Share this product and earn 5 points instantly!", bn: "এই পণ্যটি শেয়ার করুন এবং তাৎক্ষণিকভাবে ৫ পয়েন্ট উপার্জন করুন!" },
    rewardPoints: { en: "Reward Points", bn: "রিওয়ার্ড পয়েন্ট" },
    referralBonusMessage: { en: "A friend has been rewarded thanks to your purchase!", bn: "আপনার কেনার জন্য একজন বন্ধু পুরস্কৃত হয়েছে!" },
    shareProduct: { en: "Share Product", bn: "পণ্য শেয়ার করুন" },
    shareViaEmail: { en: "Share via Email", bn: "ইমেলের মাধ্যমে শেয়ার করুন" },
    recipientEmail: { en: "Recipient's Email", bn: "প্রাপকের ইমেল" },
    sendEmail: { en: "Send", bn: "পাঠান" },
    copyLink: { en: "Copy Referral Link", bn: "রেফারেল লিঙ্ক কপি করুন" },
    linkCopied: { en: "Copied!", bn: "কপি হয়েছে!" },
    copy: { en: "Copy", bn: "কপি" },
    orShareVia: { en: "Or share via", bn: "অথবা এর মাধ্যমে শেয়ার করুন" },
    
    // Profile Page
    myProfile: { en: "My Profile", bn: "আমার প্রোফাইল" },
    userInfo: { en: "User Information", bn: "ব্যবহারকারীর তথ্য" },
    rewardPointsBalance: { en: "Reward Points Balance", bn: "রিওয়ার্ড পয়েন্ট ব্যালেন্স" },
    savedAddresses: { en: "Saved Addresses", bn: "সংরক্ষিত ঠিকানা" },
    addNewAddress: { en: "Add New Address", bn: "নতুন ঠিকানা যোগ করুন" },
    orderHistory: { en: "Order History", bn: "অর্ডারের ইতিহাস" },
    orderId: { en: "Order ID", bn: "অর্ডার আইডি" },
    date: { en: "Date", bn: "তারিখ" },
    total: { en: "Total", bn: "মোট" },
    status: { en: "Status", bn: "স্ট্যাটাস" },
    viewDetails: { en: "View Details", bn: "বিস্তারিত দেখুন" },
    hideDetails: { en: "Hide Details", bn: "বিস্তারিত লুকান" },
    itemsInOrder: { en: "Items in this order", bn: "এই অর্ডারের আইটেম" },
    uploadImage: { en: "Upload Image", bn: "ছবি আপলোড করুন" },
};
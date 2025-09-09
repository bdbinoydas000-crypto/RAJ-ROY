import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { Product, CustomizationState, ProductVariation, Review } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReward } from '../context/RewardContext';
import { restorePhotoWithAI } from '../services/geminiService';
import { MOCK_REVIEWS } from '../constants';
import StarRating from '../components/StarRating';

// --- START of inlined ShareModal component ---
interface ShareModalProps {
    product: Product;
    referralUrl: string;
    onClose: () => void;
    onShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ product, referralUrl, onClose, onShare }) => {
    const { t } = useLocalization();
    const [isMounted, setIsMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleAction = (callback: () => void) => {
        onShare(); // Award points on any share action
        callback();
    };

    const handleSocialShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
        handleAction(() => {
            const shareText = `Check out this amazing ${t(product.nameKey)} from ${t('appName')}!`;
            let shareUrl = '';
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareText)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + referralUrl)}`;
                    break;
            }
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        });
    };
    
    const handleEmailShare = (e: React.FormEvent) => {
        e.preventDefault();
        if(email) {
            handleAction(() => {
                alert(`Sharing link with ${email}. (This is a mock action)`);
                setEmail('');
            });
        }
    };

    const handleCopyLink = () => {
        handleAction(() => {
            navigator.clipboard.writeText(referralUrl).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 p-8 w-full max-w-lg m-4 transform transition-all duration-500 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('shareProduct')}</h2>
                        <p className="text-gray-400 mt-1">{t(product.nameKey)}</p>
                    </div>
                     <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <img src={product.imageUrl} alt={t(product.nameKey)} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1 w-full">
                        <label className="text-sm text-gray-400">{t('copyLink')}</label>
                        <div className="flex items-center space-x-2 mt-1">
                            <input 
                                type="text"
                                readOnly
                                value={referralUrl}
                                className="w-full bg-gray-700 text-gray-300 rounded-lg px-3 py-2 border border-gray-600 focus:outline-none"
                            />
                            <button onClick={handleCopyLink} className="bg-purple-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                {copySuccess ? t('linkCopied') : t('copy')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-500">{t('orShareVia')}</span></div>
                </div>

                <div className="flex items-center justify-center space-x-4 mb-6">
                    <button onClick={() => handleSocialShare('facebook')} className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-transform transform hover:scale-110"><svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.24h-1.172c-1.227 0-1.636.782-1.636 1.592V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z"></path></svg></button>
                    <button onClick={() => handleSocialShare('twitter')} className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500 text-white transition-transform transform hover:scale-110"><svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085 4.93 4.93 0 004.6 3.42 9.86 9.86 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.213 0-.425-.015-.637A9.954 9.954 0 0024 4.59z"></path></svg></button>
                    <button onClick={() => handleSocialShare('whatsapp')} className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white transition-transform transform hover:scale-110"><svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.42-1.4c1.4.74 2.97 1.18 4.62 1.18h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.92-9.91zM17.5 14.3c-.28-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.61.14-.18.28-.71.89-.87 1.07-.16.18-.32.2-.59.06-.28-.14-1.17-.43-2.23-1.38-.83-.73-1.39-1.63-1.55-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.37-.02-.51-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.46-.61-.47-.16 0-.34-.02-.52-.02-.18 0-.46.07-.7.35-.25.28-.94.92-.94 2.25s.96 2.61 1.1 2.79c.14.18 1.89 2.9 4.58 4.04.62.26 1.1.42 1.48.53.59.18 1.13.16 1.56.1.48-.07 1.62-.66 1.85-1.29.23-.63.23-1.17.16-1.29-.07-.12-.25-.19-.52-.33z"></path></svg></button>
                </div>

                <form onSubmit={handleEmailShare}>
                     <label className="text-sm text-gray-400">{t('shareViaEmail')}</label>
                     <div className="flex items-center space-x-2 mt-1">
                        <input type="email" placeholder={t('recipientEmail')} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <button type="submit" className="bg-pink-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">{t('sendEmail')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// --- END of inlined ShareModal component ---

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const InteractiveStarRating: React.FC<{ rating: number; setRating: (r: number) => void }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    type="button"
                    key={star}
                    aria-label={`Rate ${star} stars`}
                    className="text-2xl outline-none focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                >
                    <svg className={`h-7 w-7 transition-colors ${ (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

interface ProductPageProps {
    product: Product;
    navigateTo: (page: 'home' | 'checkout' | 'confirmation') => void;
    initialCustomization: CustomizationState | null;
    isAuthenticated: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const ProductPage: React.FC<ProductPageProps> = ({ product, navigateTo, initialCustomization, isAuthenticated }) => {
    const { t } = useLocalization();
    const { addToCart } = useCart();
    const { addToWishlist, isItemInWishlist } = useWishlist();
    const { addPoints } = useReward();

    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [imageMime, setImageMime] = useState<string>('');
    const [text, setText] = useState('');
    const [font, setFont] = useState('serif');
    const [color, setColor] = useState('#FFFFFF');
    const [isRestoring, setIsRestoring] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        sepia: 0,
        grayscale: 0,
    });
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Review State
    const productReviews = useMemo(() => MOCK_REVIEWS.filter(r => r.productId === product.id), [product.id]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newRating, setNewRating] = useState<number>(5);
    const [newComment, setNewComment] = useState<string>('');
    const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

    useEffect(() => {
        setReviews(productReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, [productReviews]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (product.variations && product.variations.length > 0) {
            setSelectedVariation(product.variations[0]);
        } else {
            setSelectedVariation(null);
        }
    }, [product]);

    const getCurrentCustomizationState = (): CustomizationState | null => {
        if (!originalImageSrc) return null;
        return { originalImageSrc, imageMime, text, font, color, filters };
    }

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const currentState = getCurrentCustomizationState();
        if (currentState) {
            setIsSaved(isItemInWishlist(product, currentState));
        } else {
            setIsSaved(false);
        }
    }, [originalImageSrc, imageMime, text, font, color, filters, product, isItemInWishlist]);

     useEffect(() => {
        if (initialCustomization) {
            setOriginalImageSrc(initialCustomization.originalImageSrc);
            setImageMime(initialCustomization.imageMime);
            setText(initialCustomization.text);
            setFont(initialCustomization.font);
            setColor(initialCustomization.color);
            setFilters(initialCustomization.filters);
        }
    }, [initialCustomization]);


    useEffect(() => {
        if (!originalImageSrc || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            if (ctx) {
                const { brightness, contrast, sepia, grayscale } = filters;
                ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%) grayscale(${grayscale}%)`;
                ctx.drawImage(img, 0, 0);
            }
        };

        img.src = originalImageSrc; 

    }, [filters, originalImageSrc]);


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const base64 = await fileToBase64(file);
            setOriginalImageSrc(base64);
            setImageMime(file.type);
            setFilters({ brightness: 100, contrast: 100, sepia: 0, grayscale: 0 });
        }
    };
    
    const handleRestoreClick = useCallback(async () => {
        if (!originalImageSrc) return;
        setIsRestoring(true);
        try {
            const base64Data = originalImageSrc.split(',')[1];
            const restoredBase64 = await restorePhotoWithAI(base64Data, imageMime);
            setOriginalImageSrc(`data:${imageMime};base64,${restoredBase64}`);
            setFilters({ brightness: 100, contrast: 100, sepia: 0, grayscale: 0 });
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsRestoring(false);
        }
    }, [originalImageSrc, imageMime]);

    const handleAddToCart = () => {
        if (product.customizable && !originalImageSrc) {
            alert("Please upload a photo to customize your product.");
            return;
        }
        setIsAdding(true);
        setTimeout(() => {
            const finalImageUrl = canvasRef.current ? canvasRef.current.toDataURL(imageMime) : (selectedVariation?.imageUrl || product.imageUrl);
            addToCart(product, 1, { imageUrl: finalImageUrl, text }, selectedVariation || undefined);
            navigateTo('checkout');
        }, 1200);
    };

    const handleSaveToWishlist = () => {
        const currentState = getCurrentCustomizationState();
        if (currentState) {
            addToWishlist(product, currentState);
        } else {
            alert("Please upload an image before saving.");
        }
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || newRating === 0) {
            alert("Please provide a rating and a comment.");
            return;
        }
        setIsSubmittingReview(true);
        
        const token = localStorage.getItem('authToken');
        const payload = token ? parseJwt(token) : {};
        const userName = payload?.name || 'Valued Customer';

        setTimeout(() => {
            const newReview: Review = {
                id: `r${Date.now()}`,
                productId: product.id,
                userName: userName,
                rating: newRating,
                comment: newComment,
                date: new Date().toISOString().split('T')[0],
            };
            setReviews(prev => [newReview, ...prev]);
            setIsSubmittingReview(false);
            setNewComment('');
            setNewRating(5);
        }, 1000);
    };

    const referralUrl = useMemo(() => {
        if (!isAuthenticated) return '';

        const token = localStorage.getItem('authToken');
        if (!token) return '';

        try {
            const payload = parseJwt(token);
            const userId = payload.email || payload.user;
            if (!userId) return '';
            const productUrl = window.location.href.split('?')[0].split('#')[0];
            return `${productUrl}?ref=${btoa(userId)}`;
        } catch (e) {
            console.error("Error generating referral URL:", e);
            return '';
        }
    }, [isAuthenticated]);
    
    const handleShareAction = useCallback(() => {
        if (isAuthenticated) {
            addPoints(5);
        }
    }, [isAuthenticated, addPoints]);


    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
                {/* Customizer Preview */}
                <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center aspect-square shadow-inner">
                    {!originalImageSrc ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <img src={selectedVariation?.imageUrl || product.imageUrl} alt={t(product.nameKey)} className="max-w-full max-h-full object-contain rounded-md" />
                        </div>
                    ) : (
                        <div className="relative w-full h-full">
                            <canvas ref={canvasRef} className="w-full h-full object-contain" />
                            {text && (
                                <div className="absolute bottom-4 left-4 right-4 text-center p-2 bg-black/50 rounded pointer-events-none" style={{ fontFamily: font, color: color }}>
                                    {text}
                                </div>
                            )}
                            {isRestoring && (
                                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
                                <p className="mt-4 text-lg font-semibold">{t('restoring')}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Customizer Controls */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-serif font-bold">{t('customizeYour')} {t(product.nameKey)}</h2>
                        {product.reviewCount && product.reviewCount > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                                <StarRating rating={product.averageRating || 0} />
                                <span className="text-sm text-gray-400">
                                    {product.averageRating?.toFixed(1)} stars ({product.reviewCount} reviews)
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">1. {t('uploadPhoto')}</h3>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full bg-purple-600 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors">
                            {originalImageSrc ? t('changePhoto') : t('uploadPhoto')}
                        </button>
                        {product.id === 'p2' && originalImageSrc && (
                            <button onClick={handleRestoreClick} disabled={isRestoring} className="w-full mt-3 bg-teal-500 py-3 rounded-lg font-bold hover:bg-teal-600 transition-colors disabled:bg-gray-500">
                                {isRestoring ? t('restoring') : t('restoreWithAI')}
                            </button>
                        )}
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">2. Apply Filters</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                            <button onClick={() => setFilters({ ...filters, grayscale: 100, sepia: 0 })} className="bg-gray-700 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">Grayscale</button>
                            <button onClick={() => setFilters({ ...filters, sepia: 100, grayscale: 0 })} className="bg-gray-700 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">Sepia</button>
                            <button onClick={() => setFilters({ ...filters, grayscale: 0, sepia: 0 })} className="bg-gray-700 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">Color</button>
                            <button onClick={() => setFilters({ brightness: 100, contrast: 100, sepia: 0, grayscale: 0 })} className="bg-purple-600 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors">Reset All</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Brightness ({filters.brightness}%)</label>
                                <input type="range" min="0" max="200" value={filters.brightness} onChange={(e) => setFilters({...filters, brightness: parseInt(e.target.value)})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Contrast ({filters.contrast}%)</label>
                                <input type="range" min="0" max="200" value={filters.contrast} onChange={(e) => setFilters({...filters, contrast: parseInt(e.target.value)})} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">3. {t('addText')}</h3>
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('enterText')} className="w-full bg-gray-700 p-2 rounded mb-4" />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">{t('fontStyle')}</label>
                                <select value={font} onChange={(e) => setFont(e.target.value)} className="w-full bg-gray-700 p-2 rounded">
                                    <option value="serif">Playfair Display</option>
                                    <option value="sans-serif">Roboto</option>
                                    <option value="monospace">Monospace</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">{t('textColor')}</label>
                                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 bg-gray-700 p-1 rounded" />
                            </div>
                        </div>
                    </div>

                    {product.variations && (
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">4. {t('selectSize')}</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.variations.map(variation => (
                                    <button 
                                        key={variation.id}
                                        onClick={() => setSelectedVariation(variation)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all border-2 ${
                                            selectedVariation?.id === variation.id 
                                            ? 'bg-purple-600 border-purple-400 text-white' 
                                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
                                        }`}
                                    >
                                        {t(variation.nameKey)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {isAuthenticated && (
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">{t('shareAndEarn')}</h3>
                            <p className="text-gray-400 mb-4">{t('sharePrompt')}</p>
                            <button 
                                onClick={() => setIsShareModalOpen(true)}
                                className="w-full bg-teal-500 py-3 rounded-lg font-bold hover:bg-teal-600 transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                                <span>{t('shareProduct')}</span>
                            </button>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={handleSaveToWishlist} 
                            disabled={isSaved || !originalImageSrc}
                            className="w-full sm:w-auto flex-grow bg-gray-700 text-white font-bold py-4 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-green-600 disabled:opacity-80"
                        >
                            {isSaved ? t('saved') : t('saveToWishlist')}
                        </button>
                        <button 
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`w-full sm:w-auto flex-grow text-white font-bold text-lg py-4 rounded-lg transition-all transform flex items-center justify-center ${
                                isAdding 
                                ? 'bg-green-500 scale-105' 
                                : 'bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90 hover:scale-105'
                            }`}
                        >
                            {isAdding ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Added!
                                </>
                            ) : (
                                `${t('addToCart')} - ₹${selectedVariation ? selectedVariation.price : product.price}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Reviews Section */}
            <div className="mt-16 animate-fade-in-up">
                <h3 className="text-3xl font-serif font-bold border-l-4 border-purple-500 pl-4 mb-6">{t('reviews')}</h3>

                {isAuthenticated && (
                    <div className="bg-gray-800 p-6 rounded-lg mb-8">
                        <h4 className="text-xl font-bold mb-4">{t('writeReview')}</h4>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-400 mb-2">{t('yourRating')}</label>
                                <InteractiveStarRating rating={newRating} setRating={setNewRating} />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-2">{t('yourComment')}</label>
                                <textarea 
                                    id="comment" 
                                    rows={4} 
                                    value={newComment} 
                                    onChange={e => setNewComment(e.target.value)}
                                    className="w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Tell us what you think..."
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmittingReview}
                                className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-500"
                            >
                                {isSubmittingReview ? t('submitting') : t('submitReview')}
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-6">
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="bg-gray-800 p-5 rounded-lg animate-fade-in">
                            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white flex-shrink-0">{review.userName.charAt(0)}</div>
                                    <span className="font-bold">{review.userName}</span>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-gray-300 py-2">{review.comment}</p>
                            <p className="text-xs text-gray-500 text-right mt-2">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                    )) : <p className="text-gray-500 text-center py-8">{t('noReviews')}</p>}
                </div>
            </div>

            {isShareModalOpen && (
                <ShareModal 
                    product={product}
                    referralUrl={referralUrl}
                    onClose={() => setIsShareModalOpen(false)}
                    onShare={handleShareAction}
                />
            )}
        </>
    );
};

export default ProductPage;
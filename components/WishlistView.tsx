
import React, { useEffect, useState, useRef } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useLocalization } from '../context/LocalizationContext';
import type { WishlistItem, FilterState } from '../types';

interface WishlistViewProps {
    onClose: () => void;
    onLoadDesign: (item: WishlistItem) => void;
}

const WishlistItemCard: React.FC<{ item: WishlistItem, onLoad: () => void, onRemove: () => void }> = ({ item, onLoad, onRemove }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useLocalization();

    useEffect(() => {
        const { customization } = item;
        const canvas = canvasRef.current;
        if (!canvas || !customization.originalImageSrc) return;

        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            if (ctx) {
                const filters = {
                    blur: 0,
                    ...customization.filters
                } as FilterState;

                ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) blur(${filters.blur}px)`;
                ctx.drawImage(img, 0, 0);
            }
        };

        img.src = customization.originalImageSrc;

    }, [item]);

    return (
        <div className="flex flex-col bg-gray-700 rounded-lg overflow-hidden mb-4 p-3">
             <div className="w-full h-32 bg-gray-900/50 flex items-center justify-center rounded-md mb-3">
                 <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
             </div>
             <h3 className="font-bold text-sm truncate">{t(item.product.nameKey)}</h3>
             <div className="flex items-center space-x-2 mt-3">
                <button onClick={onLoad} className="flex-grow bg-purple-600 text-white font-bold text-xs py-2 rounded-md hover:bg-purple-700 transition-colors">
                    {t('loadDesign')}
                </button>
                <button onClick={onRemove} className="flex-shrink-0 text-red-500 hover:text-red-400 p-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                    &#x1F5D1;
                </button>
            </div>
        </div>
    );
};


const WishlistView: React.FC<WishlistViewProps> = ({ onClose, onLoadDesign }) => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { t } = useLocalization();
    const [isMounted, setIsMounted] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                    <h2 className="text-xl font-serif font-bold text-purple-400">{t('savedDesigns')}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-500">{t('emptyWishlist')}</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-4">
                        {wishlistItems.map(item => (
                           <WishlistItemCard 
                                key={item.id} 
                                item={item}
                                onLoad={() => onLoadDesign(item)}
                                onRemove={() => removeFromWishlist(item.id)}
                           />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistView;
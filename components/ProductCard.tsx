
import React from 'react';
import type { Product } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import StarRating from './StarRating';

interface ProductCardProps {
    product: Product;
    onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
    const { t } = useLocalization();
    
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 group animate-fade-in-up flex flex-col">
            <div className="relative">
                <img src={product.imageUrl} alt={t(product.nameKey)} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-serif font-bold text-white">{t(product.nameKey)}</h3>
                <p className="text-gray-400 text-sm mt-1 mb-2 flex-grow">{t(product.descriptionKey)}</p>
                
                {product.reviewCount && product.reviewCount > 0 ? (
                    <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={product.averageRating || 0} />
                        <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>
                ) : (
                     <div className="h-[28px] mb-3"></div>
                )}

                <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold text-purple-400">₹{product.price}</span>
                    <button 
                        onClick={() => onSelect(product)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105 text-sm"
                    >
                        {product.customizable ? 'Customize' : 'View Details'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
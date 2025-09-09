import React, { useMemo, useState } from 'react';
import type { Product } from '../types';
import { PRODUCTS, CATEGORIES, CAROUSEL_SLIDES } from '../constants';
import { useLocalization } from '../context/LocalizationContext';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import type { Page } from '../App';

interface HomePageProps {
    onProductSelect: (product: Product) => void;
    searchQuery: string;
    navigateTo: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onProductSelect, searchQuery, navigateTo }) => {
    const { t } = useLocalization();
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('relevance');

    const processedProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        let products = query 
            ? PRODUCTS.filter(p => t(p.nameKey).toLowerCase().includes(query))
            : [...PRODUCTS];

        if (activeCategory !== 'all') {
            products = products.filter(p => p.categoryKey === activeCategory);
        }

        switch (sortOption) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                products.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'relevance':
            default:
                // Keep original order or could implement a relevance score later
                break;
        }

        return products;
    }, [searchQuery, activeCategory, sortOption, t]);

    const renderGroupedProducts = () => {
        return Object.entries(CATEGORIES).map(([key, category]) => {
            const categoryProducts = processedProducts.filter(p => p.categoryKey === key);
            if (categoryProducts.length === 0) return null;
            return (
                <div key={key} className="mb-12 animate-fade-in-up">
                    <h3 className="text-3xl font-serif font-bold border-l-4 border-purple-500 pl-4 mb-6">
                        {t(category.nameKey)}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryProducts.map(product => (
                            <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
                        ))}
                    </div>
                </div>
            );
        });
    };
    
    const renderFlatProductList = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {processedProducts.map(product => (
                <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            {!searchQuery && <Carousel slides={CAROUSEL_SLIDES} />}

            {/* Filter and Sort Controls */}
            <div className="sticky top-[68px] bg-gray-800/90 backdrop-blur-lg z-40 p-4 rounded-lg shadow-lg border border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <button 
                            onClick={() => setActiveCategory('all')}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${activeCategory === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            {t('all')}
                        </button>
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                             <button 
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all ${activeCategory === key ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                {t(cat.nameKey)}
                            </button>
                        ))}
                    </div>
                     <div className="flex items-center gap-2">
                        <label htmlFor="sort-select" className="text-sm text-gray-400">{t('sortBy')}</label>
                        <select
                            id="sort-select"
                            value={sortOption}
                            onChange={e => setSortOption(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="relevance">{t('relevance')}</option>
                            <option value="price-asc">{t('priceAsc')}</option>
                            <option value="price-desc">{t('priceDesc')}</option>
                            <option value="rating-desc">{t('ratingDesc')}</option>
                        </select>
                    </div>
                </div>
            </div>

            <section id="products">
                 {processedProducts.length > 0 ? (
                    (activeCategory === 'all' && !searchQuery) 
                        ? renderGroupedProducts()
                        : renderFlatProductList()
                 ) : (
                    <div className="text-center py-16 animate-fade-in-up">
                        <h3 className="text-2xl font-serif text-gray-400">{t('noResults')}</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
                    </div>
                 )}
            </section>
        </div>
    );
};

export default HomePage;
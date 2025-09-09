import React, { useMemo, useState } from 'react';
import type { Product, Category } from '../types';
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

type SortOption = 'relevance' | 'priceAsc' | 'priceDesc' | 'ratingDesc';

const HomePage: React.FC<HomePageProps> = ({ onProductSelect, searchQuery }) => {
    const { t } = useLocalization();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortOption, setSortOption] = useState<SortOption>('relevance');

    const filteredAndSortedProducts = useMemo(() => {
        let products = [...PRODUCTS];

        // 1. Filter by search query
        const query = searchQuery.trim().toLowerCase();
        if (query) {
            products = products.filter(p => t(p.nameKey).toLowerCase().includes(query));
        }

        // 2. Filter by category
        if (selectedCategory !== 'all') {
            products = products.filter(p => p.categoryKey === selectedCategory);
        }

        // 3. Sort
        switch (sortOption) {
            case 'priceAsc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'ratingDesc':
                products.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case 'relevance':
            default:
                // Keep original order which is considered "relevance"
                break;
        }
        return products;
    }, [searchQuery, selectedCategory, sortOption, t]);

    const renderProducts = () => (
        <section id="products">
            {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up">
                    {filteredAndSortedProducts.map(product => (
                        <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 animate-fade-in-up">
                    <h3 className="text-2xl font-serif text-gray-400">{t('noResults')}</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </section>
    );

    return (
        <div className="space-y-8">
            {!searchQuery && <Carousel slides={CAROUSEL_SLIDES} />}
            
            {/* Filter and Sort Controls */}
            <div className="bg-gray-800/60 backdrop-blur-sm p-4 rounded-lg sticky top-[70px] z-40 animate-fade-in-up border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Category Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button 
                            onClick={() => setSelectedCategory('all')} 
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                                selectedCategory === 'all' 
                                ? 'bg-purple-600 text-white shadow-md' 
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                        >
                            {t('all')}
                        </button>
                        {Object.entries(CATEGORIES).map(([key, category]) => (
                             <button 
                                key={key}
                                onClick={() => setSelectedCategory(key)} 
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                                    selectedCategory === key 
                                    ? 'bg-purple-600 text-white shadow-md' 
                                    : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                {t(category.nameKey)}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <label htmlFor="sort-select" className="text-gray-400 text-sm">{t('sortBy')}</label>
                        <select 
                            id="sort-select" 
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value as SortOption)} 
                            className="bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        >
                            <option value="relevance">{t('relevance')}</option>
                            <option value="priceAsc">{t('priceAsc')}</option>
                            <option value="priceDesc">{t('priceDesc')}</option>
                            <option value="ratingDesc">{t('ratingDesc')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {renderProducts()}
        </div>
    );
};

export default HomePage;

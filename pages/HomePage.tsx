import React, { useMemo } from 'react';
import type { Product } from '../types';
import { PRODUCTS, CATEGORIES, CAROUSEL_SLIDES } from '../constants';
import { useLocalization } from '../context/LocalizationContext';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';

interface HomePageProps {
    onProductSelect: (product: Product) => void;
    searchQuery: string;
}

const HomePage: React.FC<HomePageProps> = ({ onProductSelect, searchQuery }) => {
    const { t } = useLocalization();

    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return PRODUCTS;
        }
        return PRODUCTS.filter(p => t(p.nameKey).toLowerCase().includes(query));
    }, [searchQuery, t]);

    const categoriesWithProducts = useMemo(() => {
        return Object.entries(CATEGORIES)
            .map(([key, category]) => ({
                key,
                category,
                products: filteredProducts.filter(p => p.categoryKey === key)
            }))
            .filter(c => c.products.length > 0);
    }, [filteredProducts]);


    return (
        <div className="space-y-16">
            {!searchQuery && (
                <Carousel slides={CAROUSEL_SLIDES} />
            )}

            <section className="text-center animate-fade-in-up">
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
                    Craft Your Memories
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Turn precious moments into timeless gifts. Personalized, unique, and delivered with love.
                </p>
            </section>
            
            <section>
                 {categoriesWithProducts.length > 0 ? (
                    categoriesWithProducts.map(({ key, category, products }) => (
                        <div key={key} className="mb-12">
                            <h3 className="text-3xl font-serif font-bold border-l-4 border-purple-500 pl-4 mb-6">
                                {t(category.nameKey)}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
                                ))}
                            </div>
                        </div>
                    ))
                 ) : (
                    <div className="text-center py-16 animate-fade-in-up">
                        <h3 className="text-2xl font-serif text-gray-400">{t('noResults')}</h3>
                        <p className="text-gray-500 mt-2">Try searching for something else or check your spelling.</p>
                    </div>
                 )}
            </section>
        </div>
    );
};

export default HomePage;
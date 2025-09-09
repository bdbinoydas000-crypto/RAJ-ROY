import React, { useMemo } from 'react';
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

const HomePage: React.FC<HomePageProps> = ({ onProductSelect, searchQuery }) => {
    const { t } = useLocalization();

    const searchedProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return PRODUCTS;
        return PRODUCTS.filter(p => t(p.nameKey).toLowerCase().includes(query));
    }, [searchQuery, t]);

    const renderSearchedProducts = () => (
        <section id="products">
            {searchedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
                    {searchedProducts.map(product => (
                        <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 animate-fade-in-up">
                    <h3 className="text-2xl font-serif text-gray-400">{t('noResults')}</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search term.</p>
                </div>
            )}
        </section>
    );

    const renderCategorizedProducts = () => {
        return Object.entries(CATEGORIES as { [key: string]: Category }).map(([key, category]) => {
            const categoryProducts = PRODUCTS.filter(p => p.categoryKey === key);
            if (categoryProducts.length === 0) return null;

            return (
                <section key={key} className="relative rounded-2xl overflow-hidden my-12 animate-fade-in-up shadow-2xl shadow-purple-900/20">
                    <img src={category.backgroundImageUrl} alt={t(category.nameKey)} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30" />
                    <div className="absolute inset-0 bg-gray-900/60"></div>

                    <div className="relative z-10 p-8 md:p-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-8 text-white drop-shadow-lg">
                            {t(category.nameKey)}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryProducts.map(product => (
                                <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
                            ))}
                        </div>
                    </div>
                </section>
            );
        });
    };

    return (
        <div className="space-y-8">
            {!searchQuery && <Carousel slides={CAROUSEL_SLIDES} />}

            {searchQuery ? renderSearchedProducts() : renderCategorizedProducts()}
        </div>
    );
};

export default HomePage;

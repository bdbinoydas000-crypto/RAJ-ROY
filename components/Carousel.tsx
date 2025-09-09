import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { CarouselSlide } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface CarouselProps {
    slides: CarouselSlide[];
    autoPlayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ slides, autoPlayInterval = 5000 }) => {
    const { t } = useLocalization();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (progressRef.current) {
             // Reset animation
            progressRef.current.style.transition = 'none';
            progressRef.current.style.width = '0%';
            // Force reflow
            progressRef.current.getBoundingClientRect(); 
            progressRef.current.style.transition = `width ${autoPlayInterval}ms linear`;
            progressRef.current.style.width = '100%';
        }
    }, [autoPlayInterval]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        resetTimeout();
    }, [slides.length, resetTimeout]);

    useEffect(() => {
        if (!isPaused) {
            resetTimeout();
            timeoutRef.current = setTimeout(goToNext, autoPlayInterval);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentIndex, isPaused, autoPlayInterval, goToNext, resetTimeout]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
        resetTimeout();
    };
    
    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        resetTimeout();
    }

    const getSlideStyle = (index: number) => {
        const offset = index - currentIndex;
        const total = slides.length;
        
        let normalizedOffset = offset;
        if (offset > total / 2) {
            normalizedOffset = offset - total;
        } else if (offset < -total / 2) {
            normalizedOffset = offset + total;
        }

        const transform = `rotateY(${normalizedOffset * -30}deg) translateX(${normalizedOffset * 25}%) scale(${1 - Math.abs(normalizedOffset) * 0.2})`;
        const zIndex = total - Math.abs(normalizedOffset);
        const opacity = Math.abs(normalizedOffset) > 1 ? 0 : 1;

        return {
            transform,
            zIndex,
            opacity,
            pointerEvents: normalizedOffset === 0 ? 'auto' : 'none'
        } as React.CSSProperties;
    };


    return (
        <div 
            className="relative w-full h-[60vh] max-h-[500px] mb-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div 
                className="relative w-full h-full"
                style={{ perspective: '1000px' }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className="absolute w-full h-full transition-transform duration-700 ease-in-out"
                        style={getSlideStyle(index)}
                    >
                        <img 
                            src={slide.imageUrl} 
                            alt={t(slide.titleKey)} 
                            className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-purple-900/30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white w-full md:w-3/4">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold drop-shadow-lg">{t(slide.titleKey)}</h2>
                            <p className="mt-2 text-md md:text-lg drop-shadow-lg">{t(slide.subtitleKey)}</p>
                            <a 
                                href={slide.ctaLink}
                                className="inline-block mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity transform hover:scale-105"
                            >
                                {t(slide.ctaKey)}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={goToPrevious}
                className="absolute top-1/2 left-0 md:-left-4 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors z-40"
                aria-label="Previous slide"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                onClick={goToNext}
                className="absolute top-1/2 right-0 md:-right-4 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors z-40"
                aria-label="Next slide"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Dots and Progress Bar */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-full px-4 flex flex-col items-center gap-2">
                <div className="flex justify-center space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
                <div className="w-full max-w-xs h-1 bg-white/20 rounded-full overflow-hidden">
                    <div ref={progressRef} className="h-full bg-white" style={{ width: '0%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
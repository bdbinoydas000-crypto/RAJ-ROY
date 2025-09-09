import React from 'react';

interface StarRatingProps {
    rating: number;
    totalStars?: number;
    className?: string;
}

const Star: React.FC<{ percent: number }> = ({ percent }) => (
    <div className="relative inline-block h-5 w-5 text-yellow-400" aria-hidden="true">
        {/* Background (empty) star */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full absolute top-0 left-0 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {/* Foreground (filled) star, clipped */}
        <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percent}%` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        </div>
    </div>
);

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5, className = '' }) => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
        if (i <= rating) {
            stars.push(<Star key={i} percent={100} />);
        } else if (i > rating && i - 1 < rating) {
            const percent = (rating - (i - 1)) * 100;
            stars.push(<Star key={i} percent={percent} />);
        } else {
            stars.push(<Star key={i} percent={0} />);
        }
    }
    return <div className={`flex items-center ${className}`} title={`${rating.toFixed(1)} out of ${totalStars} stars`}>{stars}</div>;
};

export default StarRating;

import React from 'react';
import type { OrderStatus } from '../types';

interface OrderStatusTrackerProps {
    status: OrderStatus;
}

const CheckmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
    const statuses: OrderStatus[] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    
    // For 'Cancelled' status, we don't show the tracker.
    if (status === 'Cancelled') {
        return null;
    }
    
    const currentStatusIndex = statuses.indexOf(status);

    return (
        <div className="w-full px-2 sm:px-4">
            <div className="flex items-center justify-between">
                {statuses.map((step, index) => {
                    const isCompleted = index < currentStatusIndex;
                    const isActive = index === currentStatusIndex;
                    const isFuture = index > currentStatusIndex;
                    
                    const iconColor = isCompleted ? 'bg-purple-500' : isActive ? 'bg-amber-500 animate-pulse-slow' : 'bg-gray-600';
                    const textColor = isCompleted ? 'text-purple-300' : isActive ? 'text-amber-400' : 'text-gray-500';
                    const lineColor = index < currentStatusIndex ? 'bg-purple-500' : 'bg-gray-600';

                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${iconColor}`}>
                                    {isCompleted ? <CheckmarkIcon /> : <span className="font-bold">{index + 1}</span>}
                                </div>
                                <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors duration-500 ${textColor}`}>{step}</p>
                            </div>
                            {index < statuses.length - 1 && (
                                <div className={`flex-1 h-1.5 rounded-full mx-2 transition-colors duration-500 ${lineColor}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTracker;

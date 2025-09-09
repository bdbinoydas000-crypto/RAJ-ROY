import React, { useState, useEffect, useMemo } from 'react';
import type { Order } from '../types';

interface TrackingModalProps {
    order: Order;
    onClose: () => void;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ order, onClose }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const estimatedDeliveryDate = useMemo(() => {
        if (order.status === 'Delivered') {
            return new Date(order.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        const orderDate = new Date(order.date);
        // Estimate delivery 2 days after shipping for mock purposes
        orderDate.setDate(orderDate.getDate() + 2);
        return orderDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }, [order.date, order.status]);

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 p-6 w-full max-w-2xl m-4 transform transition-all duration-500 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Track Your Package</h2>
                        <p className="text-gray-400 text-sm">Order ID: {order.id}</p>
                    </div>
                     <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Map Section */}
                    <div className="relative h-64 md:h-auto rounded-lg overflow-hidden bg-gray-700">
                        <img 
                            src={`https://picsum.photos/seed/${order.id}/600/600`} 
                            alt="Delivery Map"
                            className="w-full h-full object-cover opacity-50" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white bg-black/50 px-4 py-2 rounded-md">Live map not available</p>
                        </div>
                    </div>
                    
                    {/* Info Section */}
                    <div className="space-y-4">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-lg font-bold text-amber-400">{order.status}</p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">Tracking ID</p>
                            <p className="text-lg font-bold text-gray-200">{order.trackingId}</p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-400">Shipping Provider</p>
                            <p className="text-lg font-bold text-gray-200">{order.shippingProvider}</p>
                        </div>
                        <div className="bg-purple-900/50 border border-purple-500 p-4 rounded-lg">
                            <p className="text-sm text-purple-300">{order.status === 'Delivered' ? 'Delivered On' : 'Estimated Delivery'}</p>
                            <p className="text-lg font-bold text-white">{estimatedDeliveryDate}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrackingModal;

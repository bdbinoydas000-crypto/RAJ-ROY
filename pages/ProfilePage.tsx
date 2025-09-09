import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { useReward } from '../context/RewardContext';
import { MOCK_ORDERS, MOCK_ADDRESSES } from '../constants';
import type { Order, CartItem } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const getUserId = (token: string | null): string | null => {
    if (!token) return null;
    const decoded = parseJwt(token);
    return decoded?.email || decoded?.user || null;
}

interface UserInfo {
    name: string | null;
    email: string | null;
}

// Reusable Card component for the profile page
const ProfileCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
        <h3 className="text-2xl font-serif font-bold text-purple-400 mb-4 border-l-4 border-purple-500 pl-3">{title}</h3>
        {children}
    </div>
);

// Order Detail component
const OrderDetails: React.FC<{ items: CartItem[] }> = ({ items }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-gray-900/50 p-4 mt-4 rounded-md animate-fade-in-up">
            <h4 className="font-bold mb-3 text-gray-300">{t('itemsInOrder')}</h4>
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="flex items-center">
                        <img src={item.customization?.imageUrl || item.variation?.imageUrl || item.product.imageUrl} alt={t(item.product.nameKey)} className="w-16 h-16 object-cover rounded-md mr-4" />
                        <div>
                            <p className="font-semibold">{t(item.product.nameKey)}{item.variation ? ` - ${t(item.variation.nameKey)}` : ''}</p>
                            <p className="text-sm text-gray-400">Qty: {item.quantity} | Price: ₹{item.variation ? item.variation.price : item.product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProfilePage: React.FC = () => {
    const { t } = useLocalization();
    const { rewardPoints } = useReward();
    const [userInfo, setUserInfo] = useState<UserInfo>({ name: null, email: null });
    const [userId, setUserId] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const currentUserId = getUserId(token);
        setUserId(currentUserId);

        if (token) {
            const decoded = parseJwt(token);
            if (decoded) {
                setUserInfo({
                    name: decoded.name || 'Valued Customer',
                    email: decoded.email || decoded.user || 'No email provided'
                });
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            const savedImage = localStorage.getItem(`giftscape_profile_pic_${userId}`);
            if (savedImage) {
                setProfileImage(savedImage);
            }
        }
    }, [userId]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0] && userId) {
            const file = event.target.files[0];
            const base64 = await fileToBase64(file);
            setProfileImage(base64);
            localStorage.setItem(`giftscape_profile_pic_${userId}`, base64);
        }
    };

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Delivered': return 'text-green-400';
            case 'Processing': return 'text-yellow-400';
            case 'Cancelled': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const placeholderAvatar = (
        <svg className="w-full h-full text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    return (
        <div className="max-w-5xl mx-auto animate-fade-in-up space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {t('myProfile')}
            </h2>

            {/* Top Section: Profile Pic, Info, Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                 {/* Profile Picture */}
                <div className="flex flex-col items-center md:col-span-1">
                    <div className="relative w-40 h-40">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-purple-500 shadow-lg flex items-center justify-center bg-gray-700">
                           {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                           ) : (
                                placeholderAvatar
                           )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors shadow-md"
                            title={t('uploadImage')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                </div>

                 {/* User Info & Rewards */}
                <div className="md:col-span-2 space-y-8">
                    <ProfileCard title={t('userInfo')}>
                        <p className="text-lg"><span className="font-semibold">Name:</span> {userInfo.name}</p>
                        <p className="text-lg"><span className="font-semibold">Email:</span> {userInfo.email}</p>
                    </ProfileCard>
                    <ProfileCard title={t('rewardPointsBalance')}>
                        <div className="flex items-center text-4xl font-bold text-yellow-400">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {rewardPoints}
                        </div>
                    </ProfileCard>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                {/* Saved Addresses */}
                <ProfileCard title={t('savedAddresses')}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_ADDRESSES.map(addr => (
                            <div key={addr.id} className="bg-gray-700/50 p-3 rounded-md">
                                <p className="font-bold flex justify-between items-center">
                                    {addr.type}
                                    {addr.isDefault && <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Default</span>}
                                </p>
                                <p className="text-gray-300">{addr.line1}</p>
                                <p className="text-gray-300">{addr.city}, {addr.pincode}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 bg-purple-600 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors text-sm">
                        {t('addNewAddress')}
                    </button>
                </ProfileCard>
            </div>

            {/* Order History */}
            <ProfileCard title={t('orderHistory')}>
                <div className="space-y-4">
                    {MOCK_ORDERS.map(order => (
                        <div key={order.id} className="bg-gray-700/50 p-4 rounded-lg transition-all duration-300">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                                <div><span className="md:hidden font-semibold">ID: </span>{order.id}</div>
                                <div><span className="md:hidden font-semibold">{t('date')}: </span>{order.date}</div>
                                <div><span className="md:hidden font-semibold">{t('total')}: </span>₹{order.total.toFixed(2)}</div>
                                <div className={`${getStatusColor(order.status)} font-bold`}><span className="md:hidden font-semibold text-white">{t('status')}: </span>{order.status}</div>
                                <button
                                    onClick={() => toggleOrderDetails(order.id)}
                                    className="col-span-2 md:col-span-1 bg-gray-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm"
                                >
                                    {expandedOrderId === order.id ? t('hideDetails') : t('viewDetails')}
                                </button>
                            </div>
                             {expandedOrderId === order.id && <OrderDetails items={order.items} />}
                        </div>
                    ))}
                </div>
            </ProfileCard>
        </div>
    );
};

export default ProfilePage;
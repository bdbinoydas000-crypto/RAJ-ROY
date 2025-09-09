import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { RewardContextType } from '../types';

const parseJwt = (token: string) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const getUserId = (): string | null => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    const decoded = parseJwt(token);
    return decoded?.email || decoded?.user || null;
};

const REWARDS_STORAGE_KEY_PREFIX = 'giftscape_rewards_';

const RewardContext = createContext<RewardContextType | undefined>(undefined);

export const RewardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [rewardPoints, setRewardPoints] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(() => getUserId());

    useEffect(() => {
        const checkUser = () => {
            const currentUserId = getUserId();
            if (currentUserId !== userId) {
                setUserId(currentUserId);
            }
        };
        // Check user on mount and then poll for changes (e.g., login/logout in another tab)
        checkUser();
        const intervalId = setInterval(checkUser, 1000); 
        return () => clearInterval(intervalId);
    }, [userId]);

    useEffect(() => {
        if (userId) {
            try {
                const storedPoints = localStorage.getItem(`${REWARDS_STORAGE_KEY_PREFIX}${userId}`);
                setRewardPoints(storedPoints ? JSON.parse(storedPoints) : 0);
            } catch (error) {
                console.error("Could not load reward points from localStorage", error);
                setRewardPoints(0);
            }
        } else {
            setRewardPoints(0);
        }
    }, [userId]);

    const addPoints = useCallback((points: number, forUserId?: string) => {
        const targetUserId = forUserId || userId;
        if (!targetUserId) {
            console.error("Cannot add points: no user specified.");
            return;
        }

        try {
            const storageKey = `${REWARDS_STORAGE_KEY_PREFIX}${targetUserId}`;
            const currentPoints = parseInt(localStorage.getItem(storageKey) || '0', 10);
            const newPoints = Math.max(0, currentPoints + points);
            localStorage.setItem(storageKey, JSON.stringify(newPoints));
            
            if (targetUserId === userId) {
                setRewardPoints(newPoints);
            }
        } catch (error) {
            console.error("Could not save reward points to localStorage", error);
        }
    }, [userId]);
    
    return (
        <RewardContext.Provider value={{ rewardPoints, addPoints }}>
            {children}
        </RewardContext.Provider>
    );
};

export const useReward = () => {
    const context = useContext(RewardContext);
    if (context === undefined) {
        throw new Error('useReward must be used within a RewardProvider');
    }
    return context;
};

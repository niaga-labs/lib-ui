'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AgentUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export function useAgent() {
    const router = useRouter();
    const [agent, setAgent] = useState<AgentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                router.push('/login');
                return;
            }

            if (userStr) {
                try {
                    const user = JSON.parse(userStr);

                    if (user.role !== 'agent') {
                        setIsAuthenticated(false);
                        setIsLoading(false);
                        if (user.role === 'customer') {
                            router.push('/account');
                        } else {
                            router.push('/');
                        }
                        return;
                    }

                    setAgent(user);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    setIsAuthenticated(false);
                    router.push('/login');
                }
            }

            setIsLoading(false);
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
        setAgent(null);
        setIsAuthenticated(false);
        router.push('/login');
    };

    return {
        agent,
        isLoading,
        isAuthenticated,
        logout,
        refreshAuth: checkAuth,
    };
}

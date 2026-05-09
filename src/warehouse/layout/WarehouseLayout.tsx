'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { WifiOff, LogOut } from 'lucide-react';
import BottomNav from './BottomNav';
import type { WarehouseAuthApi } from '../types';

interface WarehouseLayoutProps {
    children: ReactNode;
    /**
     * Hook returning the auth state. Consumer passes their app's
     * `useAuth` reference here. Rules of Hooks still apply — this hook
     * is called on every render of WarehouseLayout. Mirrors
     * lib-ui/admin/auth/PermissionGate's `usePermissions` injection.
     */
    useAuth: () => WarehouseAuthApi;
    /** App title shown in the top header. Defaults to "Niaga Warehouse". */
    title?: string;
}

export default function WarehouseLayout({ children, useAuth, title = 'Niaga Warehouse' }: WarehouseLayoutProps) {
    const { isAuthenticated, user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Check online status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated && pathname !== '/login') {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warehouse-light">
                <div className="spinner"></div>
            </div>
        );
    }

    // Don't show layout on login page
    if (pathname === '/login') {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-warehouse-light">
            {/* Offline Indicator */}
            {!isOnline && (
                <div className="offline-banner flex items-center justify-center gap-2">
                    <WifiOff className="w-4 h-4" />
                    <span>Offline Mode - Changes will sync when online</span>
                </div>
            )}

            {/* Top Header */}
            <header className="bg-warehouse-primary text-white py-4 px-4 sticky top-0 z-40">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{title}</h1>
                        {user && (
                            <p className="text-sm opacity-90">{user.name}</p>
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors touch-target"
                        aria-label="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="warehouse-container pb-20">
                {children}
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}

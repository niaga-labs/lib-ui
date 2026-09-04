'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, ShoppingBag, Users, Wallet, TrendingUp, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BRAND_NAME } from '../../brand';

const menuItems = [
    {
        label: 'Dashboard',
        href: '/agent',
        icon: Home,
    },
    {
        label: 'Pesanan Baru',
        href: '/agent/orders/new',
        icon: PlusCircle,
    },
    {
        label: 'Pesanan Saya',
        href: '/agent/orders',
        icon: ShoppingBag,
    },
    {
        label: 'Pelanggan Saya',
        href: '/agent/customers',
        icon: Users,
    },
    {
        label: 'Komisen',
        href: '/agent/commissions',
        icon: Wallet,
    },
    {
        label: 'Prestasi',
        href: '/agent/performance',
        icon: TrendingUp,
    },
    {
        label: 'Profil',
        href: '/agent/profile',
        icon: User,
    },
];

interface AgentSidebarProps {
    onClose?: () => void;
    /** Wordmark and footer name. Defaults to the lib-ui brand constant. */
    brand?: string;
}

export function AgentSidebar({ onClose, brand = BRAND_NAME }: AgentSidebarProps) {
    const pathname = usePathname();
    // Was the literal "DM" -- Desa Murni, the brand this product stopped using
    // on 2026-09-02 (NIAGA-99). Deriving it means the badge cannot go stale
    // again behind a renamed wordmark.
    const brandInitials = brand
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    return (
        <div className="flex flex-col h-full bg-card border-r">
            {/* Logo Section */}
            <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#B8860B] flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{brandInitials}</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-[#1f2937]">Agent Portal</h2>
                        <p className="text-xs text-muted-foreground">{brand}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                'hover:bg-accent hover:text-accent-foreground',
                                'text-muted-foreground hover:translate-x-1',
                                isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm'
                            )}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                    © {new Date().getFullYear()} {brand}
                </p>
            </div>
        </div>
    );
}

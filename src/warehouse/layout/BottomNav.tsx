'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Package, PackageCheck, PackageOpen, ClipboardList } from 'lucide-react';

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/receiving', icon: Package, label: 'Receive' },
    { href: '/picking', icon: PackageOpen, label: 'Pick' },
    { href: '/packing', icon: PackageCheck, label: 'Pack' },
    { href: '/stocktake', icon: ClipboardList, label: 'Stock' },
];

export default function BottomNav() {
    const pathname = usePathname();

    // Don't show bottom nav on login page
    if (pathname === '/login') {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full touch-target transition-colors ${isActive
                                    ? 'text-warehouse-primary'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs mt-1 font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import {
    Home, ShoppingCart, Package, Warehouse, Users, Tags,
    BarChart3, Settings, ChevronDown, ChevronRight,
    Menu, X, Bell, Search, HelpCircle, Store
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ============ NAVIGATION DATA ============
interface NavItem {
    label: string;
    href?: string;
    icon: React.ElementType;
    badge?: string;
    children?: NavItem[];
}

const navigationItems: NavItem[] = [
    {
        label: 'Home',
        href: '/dashboard',
        icon: Home,
    },
    {
        label: 'Orders',
        icon: ShoppingCart,
        children: [
            { label: 'All Orders', href: '/orders', icon: ShoppingCart },
            { label: 'Drafts', href: '/orders/drafts', icon: ShoppingCart },
            { label: 'Abandoned', href: '/orders/abandoned', icon: ShoppingCart },
        ],
    },
    {
        label: 'Products',
        icon: Package,
        children: [
            { label: 'All Products', href: '/products', icon: Package },
            { label: 'Inventory', href: '/inventory', icon: Warehouse },
            { label: 'Transfers', href: '/stock-transfers', icon: Package },
            { label: 'Categories', href: '/categories', icon: Package },
        ],
    },
    {
        label: 'Customers',
        href: '/customers',
        icon: Users,
    },
    {
        label: 'Discounts',
        href: '/discounts',
        icon: Tags,
        badge: 'New',
    },
    {
        label: 'Analytics',
        href: '/reports',
        icon: BarChart3,
    },
    {
        label: 'Settings',
        icon: Settings,
        children: [
            { label: 'General', href: '/settings', icon: Settings },
            { label: 'Payments', href: '/settings/payments', icon: Settings },
            { label: 'Users & Permissions', href: '/team', icon: Users },
        ],
    },
];

// ============ SIDEBAR ITEM ============
interface SidebarItemProps {
    item: NavItem;
    depth?: number;
}

function SidebarItem({ item, depth = 0 }: SidebarItemProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.href ? pathname === item.href : item.children?.some(child => pathname === child.href);

    // Auto-expand if any child is active
    React.useEffect(() => {
        if (hasChildren && item.children?.some(child => pathname === child.href)) {
            setIsOpen(true);
        }
    }, [pathname, hasChildren, item.children]);

    const Icon = item.icon;

    if (hasChildren) {
        return (
            <div className="mb-0.5">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        "text-[hsl(var(--p-text-subdued))] hover:text-[hsl(var(--p-text))] hover:bg-[hsl(var(--p-surface-hovered))]",
                        isActive && "text-[hsl(var(--p-text))] bg-[hsl(var(--p-surface-hovered))]"
                    )}
                >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isOpen ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </button>
                {isOpen && (
                    <div className="ml-5 mt-1 space-y-0.5 border-l border-[hsl(var(--p-border-subdued))] pl-3">
                        {item.children?.map((child) => (
                            <SidebarItem key={child.label} item={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.href || '#'}
            className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-0.5",
                "text-[hsl(var(--p-text-subdued))] hover:text-[hsl(var(--p-text))] hover:bg-[hsl(var(--p-surface-hovered))]",
                isActive && "text-[hsl(var(--p-text-interactive))] bg-[hsl(var(--p-surface-selected))]"
            )}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
                <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-[hsl(var(--p-success-subdued))] text-[hsl(var(--p-text-success))]">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}

// ============ MAIN SIDEBAR ============
interface PolarisSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PolarisSidebar({ isOpen, onClose }: PolarisSidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 h-screen w-60 bg-[hsl(var(--p-surface))] border-r border-[hsl(var(--p-border))] z-50",
                    "flex flex-col transition-transform duration-200 ease-out",
                    "lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Header */}
                <div className="flex items-center justify-between h-14 px-4 border-b border-[hsl(var(--p-border))]">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--p-interactive))] to-[hsl(var(--p-interactive-pressed))] flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-semibold text-sm text-[hsl(var(--p-text))]">Niaga Admin</span>
                            <span className="block text-xs text-[hsl(var(--p-text-subdued))]"></span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-md hover:bg-[hsl(var(--p-surface-hovered))]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    {navigationItems.map((item) => (
                        <SidebarItem key={item.label} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-[hsl(var(--p-border))]">
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[hsl(var(--p-surface-hovered))] transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-[hsl(var(--p-interactive))] flex items-center justify-center text-white text-sm font-medium">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[hsl(var(--p-text))] truncate">Admin</p>
                            <p className="text-xs text-[hsl(var(--p-text-subdued))] truncate">admin@niaga.local</p>
                        </div>
                    </Link>
                </div>
            </aside>
        </>
    );
}

// ============ TOP BAR ============
interface PolarisTopBarProps {
    onMenuClick: () => void;
}

export function PolarisTopBar({ onMenuClick }: PolarisTopBarProps) {
    return (
        <header className="sticky top-0 z-30 h-14 bg-[hsl(var(--p-surface))] border-b border-[hsl(var(--p-border))] flex items-center gap-4 px-4">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-[hsl(var(--p-surface-hovered))] transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--p-icon-subdued))]" />
                    <input
                        type="text"
                        placeholder="Search orders, products, customers..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-[hsl(var(--p-surface-subdued))] border border-transparent rounded-lg focus:bg-[hsl(var(--p-surface))] focus:border-[hsl(var(--p-border-focused))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--p-interactive))] transition-all"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-[hsl(var(--p-surface-hovered))] transition-colors relative">
                    <Bell className="w-5 h-5 text-[hsl(var(--p-icon-subdued))]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(var(--p-critical))] rounded-full" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[hsl(var(--p-surface-hovered))] transition-colors">
                    <HelpCircle className="w-5 h-5 text-[hsl(var(--p-icon-subdued))]" />
                </button>
            </div>
        </header>
    );
}

// ============ ADMIN LAYOUT ============
interface PolarisAdminLayoutProps {
    children: React.ReactNode;
}

export function PolarisAdminLayout({ children }: PolarisAdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-[hsl(var(--p-surface-subdued))]">
            <div className="flex">
                <PolarisSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 min-w-0">
                    <PolarisTopBar onMenuClick={() => setSidebarOpen(true)} />
                    <main className="p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

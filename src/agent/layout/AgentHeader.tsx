'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../../primitives/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../primitives/dropdown-menu';

interface AgentHeaderProps {
    onMenuToggle?: () => void;
    isMobileMenuOpen?: boolean;
}

export function AgentHeader({ onMenuToggle, isMobileMenuOpen }: AgentHeaderProps) {
    const router = useRouter();
    const [agentName, setAgentName] = useState('Ejen');
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        // Get agent info from localStorage
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setAgentName(user.name || 'Ejen');
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                }
            }
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuToggle}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>

                {/* Page Title - Hidden on mobile */}
                <div className="hidden sm:block">
                    <h1 className="text-xl font-semibold">Portal Ejen</h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                                    {agentName.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden sm:inline-block font-medium">{agentName}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{agentName}</p>
                                    <p className="text-xs text-muted-foreground">Portal Ejen</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/agent/profile')}>
                                Profil Saya
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/agent/commissions')}>
                                Komisen Saya
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                Log Keluar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

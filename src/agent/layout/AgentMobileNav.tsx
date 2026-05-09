'use client';

import { AgentSidebar } from './AgentSidebar';

interface AgentMobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AgentMobileNav({ isOpen, onClose }: AgentMobileNavProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className="absolute left-0 top-0 h-full w-64 bg-background shadow-lg animate-in slide-in-from-left duration-300">
                <AgentSidebar onClose={onClose} />
            </aside>
        </div>
    );
}

import Link from 'next/link';
import { Package, PackageOpen, PackageCheck, ClipboardList, ArrowLeftRight, LucideIcon } from 'lucide-react';

interface QuickAction {
    href: string;
    icon: LucideIcon;
    label: string;
    description: string;
    color: string;
}

const actions: QuickAction[] = [
    {
        href: '/receiving',
        icon: Package,
        label: 'Start Receiving',
        description: 'Process incoming stock',
        color: 'bg-blue-500',
    },
    {
        href: '/picking',
        icon: PackageOpen,
        label: 'Pick Orders',
        description: 'Pick items for orders',
        color: 'bg-purple-500',
    },
    {
        href: '/packing',
        icon: PackageCheck,
        label: 'Pack Items',
        description: 'Pack and label orders',
        color: 'bg-green-500',
    },
    {
        href: '/stocktake',
        icon: ClipboardList,
        label: 'Stock Take',
        description: 'Count inventory',
        color: 'bg-orange-500',
    },
    {
        href: '/transfers',
        icon: ArrowLeftRight,
        label: 'Transfers',
        description: 'Manage transfers',
        color: 'bg-indigo-500',
    },
];

export default function QuickActions() {
    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 px-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 px-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="card card-clickable flex flex-col items-center justify-center p-6 text-center min-h-[120px]"
                        >
                            <div className={`${action.color} p-3 rounded-lg mb-3`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="font-semibold text-gray-900 text-sm">{action.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

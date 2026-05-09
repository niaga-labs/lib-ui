import Link from 'next/link';
import { Package, Clock, CheckCircle } from 'lucide-react';
import type { PurchaseOrder } from '../types';

interface POListProps {
    orders: PurchaseOrder[];
}

export default function POList({ orders }: POListProps) {
    if (orders.length === 0) {
        return (
            <div className="card text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No purchase orders found</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {orders.map((po) => (
                <Link key={po.id} href={`/receiving/${po.id}`} className="card card-clickable block">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{po.poNumber}</h3>
                            <p className="text-sm text-gray-600">{po.supplier}</p>
                        </div>
                        <StatusBadge status={po.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Expected Date</p>
                            <p className="font-medium text-gray-900">{new Date(po.expectedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Items</p>
                            <p className="font-medium text-gray-900">{po.receivedCount}/{po.itemCount}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const classes = {
        pending: 'status-badge status-pending',
        partial: 'status-badge status-in-progress',
        completed: 'status-badge status-completed',
    };

    const icons = {
        pending: Clock,
        partial: Package,
        completed: CheckCircle,
    };

    const Icon = icons[status as keyof typeof icons] || Clock;

    return (
        <span className={classes[status as keyof typeof classes]}>
            <Icon className="w-3 h-3 inline mr-1" />
            {status}
        </span>
    );
}

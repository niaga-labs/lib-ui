import Link from 'next/link';
import { Package, Clock, Zap, Truck } from 'lucide-react';
import type { Order } from '../types';

interface OrderListProps {
    orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
    if (orders.length === 0) {
        return (
            <div className="card text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders to pick</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <Link key={order.id} href={`/picking/${order.id}`} className="card card-clickable block">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                        <div className="flex gap-2">
                            <PriorityBadge priority={order.priority} />
                            <StatusBadge status={order.status} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-medium text-gray-900">{new Date(order.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Items</p>
                            <p className="font-medium text-gray-900">{order.pickedCount}/{order.itemCount}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <ShippingBadge method={order.shippingMethod} />
                    </div>
                </Link>
            ))}
        </div>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
    const classes = {
        high: 'bg-red-100 text-red-700 border border-red-200',
        normal: 'bg-gray-100 text-gray-700 border border-gray-200',
        low: 'bg-blue-100 text-blue-700 border border-blue-200',
    };

    const icons = {
        high: Zap,
        normal: Package,
        low: Clock,
    };

    const Icon = icons[priority as keyof typeof icons] || Package;

    return (
        <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${classes[priority as keyof typeof classes]}`}>
            <Icon className="w-3 h-3" />
            {priority.toUpperCase()}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const classes = {
        ready_to_pick: 'status-badge status-pending',
        picking: 'status-badge status-in-progress',
        picked: 'status-badge status-completed',
    };

    const labels = {
        ready_to_pick: 'Ready',
        picking: 'Picking',
        picked: 'Picked',
    };

    return (
        <span className={classes[status as keyof typeof classes]}>
            {labels[status as keyof typeof labels] || status}
        </span>
    );
}

function ShippingBadge({ method }: { method: string }) {
    const classes = {
        express: 'bg-purple-50 text-purple-700',
        standard: 'bg-blue-50 text-blue-700',
        economy: 'bg-green-50 text-green-700',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${classes[method as keyof typeof classes]}`}>
            <Truck className="w-3 h-3" />
            {method.charAt(0).toUpperCase() + method.slice(1)} Shipping
        </span>
    );
}

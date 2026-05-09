import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    count: number;
    color: 'primary' | 'success' | 'warning' | 'danger';
    onClick?: () => void;
}

const colorClasses = {
    primary: 'bg-blue-50 text-warehouse-primary',
    success: 'bg-green-50 text-warehouse-success',
    warning: 'bg-orange-50 text-warehouse-warning',
    danger: 'bg-red-50 text-warehouse-danger',
};

export default function StatCard({ icon: Icon, label, count, color, onClick }: StatCardProps) {
    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            onClick={onClick}
            className={`card ${onClick ? 'card-clickable' : ''} flex items-center gap-4 p-6`}
        >
            <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
                <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
                <div className="text-3xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 mt-1">{label}</div>
            </div>
        </Component>
    );
}

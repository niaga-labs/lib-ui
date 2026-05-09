import { Card, CardContent, CardHeader, CardTitle } from '../../primitives/card';
import { DollarSign, Clock, CheckCircle, Wallet } from 'lucide-react';

interface CommissionSummaryData {
    pending: number;
    approved: number;
    paidThisMonth: number;
    totalEarned: number;
}

interface CommissionSummaryProps {
    data: CommissionSummaryData;
}

export function CommissionSummary({ data }: CommissionSummaryProps) {
    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const stats = [
        {
            title: 'Komisen Pending',
            value: formatCurrency(data.pending),
            icon: Clock,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100',
        },
        {
            title: 'Komisen Diluluskan',
            value: formatCurrency(data.approved),
            icon: CheckCircle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            subtitle: 'Menunggu bayaran',
        },
        {
            title: 'Dibayar Bulan Ini',
            value: formatCurrency(data.paidThisMonth),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Jumlah Keseluruhan',
            value: formatCurrency(data.totalEarned),
            icon: Wallet,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            {stat.subtitle && (
                                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from '../../primitives/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Clock, Target } from 'lucide-react';
import { Progress } from '../../primitives/progress';

interface StatsData {
    totalSalesThisMonth: number;
    totalOrdersThisMonth: number;
    pendingCommission: number;
    targetAmount: number;
    achievementPercent: number;
    salesTrend?: number; // percentage change from last month
    ordersTrend?: number;
}

interface StatsCardsProps {
    data: StatsData;
}

export function StatsCards({ data }: StatsCardsProps) {
    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const stats = [
        {
            title: 'Jualan Bulan Ini',
            value: formatCurrency(data.totalSalesThisMonth),
            icon: DollarSign,
            trend: data.salesTrend,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Bilangan Pesanan',
            value: data.totalOrdersThisMonth.toString(),
            icon: ShoppingCart,
            trend: data.ordersTrend,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            subtitle: 'bulan ini',
        },
        {
            title: 'Komisen Pending',
            value: formatCurrency(data.pendingCommission),
            icon: Clock,
            color: 'text-amber-600',
            bgColor: 'bg-amber-100',
            subtitle: 'belum dibayar',
        },
        {
            title: 'Pencapaian Target',
            value: `${data.achievementPercent}%`,
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            progress: data.achievementPercent,
            target: formatCurrency(data.targetAmount),
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>

                            {stat.subtitle && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.subtitle}
                                </p>
                            )}

                            {stat.trend !== undefined && (
                                <div className="flex items-center gap-1 mt-2">
                                    {stat.trend >= 0 ? (
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className={`text-xs font-medium ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {Math.abs(stat.trend)}% dari bulan lepas
                                    </span>
                                </div>
                            )}

                            {stat.progress !== undefined && (
                                <div className="mt-3 space-y-1">
                                    <Progress value={stat.progress} className="h-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Target: {stat.target}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

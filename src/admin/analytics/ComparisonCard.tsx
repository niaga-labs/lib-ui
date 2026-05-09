'use client';

import { TrendingUp, TrendingDown, Minus, ArrowRight, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@niaga/lib-ui/primitives/card';

interface PeriodStats {
    start_date: string;
    end_date: string;
    revenue: number;
    orders: number;
    avg_order: number;
    unique_items: number;
}

interface GrowthMetrics {
    revenue_change: number;
    revenue_percent: number;
    orders_change: number;
    orders_percent: number;
    avg_order_change: number;
    avg_order_percent: number;
}

interface PeriodComparisonData {
    current_period: PeriodStats;
    previous_period: PeriodStats;
    growth: GrowthMetrics;
    generated_at: string;
}

interface ComparisonCardProps {
    data: PeriodComparisonData | null;
    loading?: boolean;
}

export function ComparisonCard({ data, loading }: ComparisonCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ms-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ms-MY', {
            day: 'numeric',
            month: 'short',
        });
    };

    const formatPercent = (value: number) => {
        const sign = value > 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}%`;
    };

    const GrowthIndicator = ({ value, percent }: { value: number; percent: number }) => {
        if (percent === 0) {
            return (
                <div className="flex items-center gap-1 text-gray-500">
                    <Minus className="h-4 w-4" />
                    <span className="text-sm">0%</span>
                </div>
            );
        }

        const isPositive = percent > 0;
        return (
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                ) : (
                    <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{formatPercent(percent)}</span>
            </div>
        );
    };

    const MetricRow = ({
        label,
        current,
        previous,
        growthPercent,
        formatValue = (v: number) => v.toString(),
    }: {
        label: string;
        current: number;
        previous: number;
        growthPercent: number;
        formatValue?: (v: number) => string;
    }) => (
        <div className="grid grid-cols-4 gap-4 py-3 border-b last:border-0 items-center">
            <div className="text-sm font-medium text-gray-700">{label}</div>
            <div className="text-right">
                <span className="text-sm text-gray-500">{formatValue(previous)}</span>
            </div>
            <div className="text-right">
                <span className="text-sm font-semibold">{formatValue(current)}</span>
            </div>
            <div className="flex justify-end">
                <GrowthIndicator value={current - previous} percent={growthPercent} />
            </div>
        </div>
    );

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Perbandingan Tempoh
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return null;
    }

    const { current_period, previous_period, growth } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Perbandingan Tempoh
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(previous_period.start_date)} - {formatDate(previous_period.end_date)}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3 w-3" />
                        {formatDate(current_period.start_date)} - {formatDate(current_period.end_date)}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-4 pb-2 border-b mb-2">
                    <div className="text-xs text-gray-500 font-medium uppercase">Metrik</div>
                    <div className="text-xs text-gray-500 font-medium uppercase text-right">Tempoh Sebelum</div>
                    <div className="text-xs text-gray-500 font-medium uppercase text-right">Tempoh Semasa</div>
                    <div className="text-xs text-gray-500 font-medium uppercase text-right">Perubahan</div>
                </div>

                <MetricRow
                    label="Jumlah Hasil"
                    current={current_period.revenue}
                    previous={previous_period.revenue}
                    growthPercent={growth.revenue_percent}
                    formatValue={formatCurrency}
                />
                <MetricRow
                    label="Bilangan Pesanan"
                    current={current_period.orders}
                    previous={previous_period.orders}
                    growthPercent={growth.orders_percent}
                />
                <MetricRow
                    label="Purata Pesanan"
                    current={current_period.avg_order}
                    previous={previous_period.avg_order}
                    growthPercent={growth.avg_order_percent}
                    formatValue={formatCurrency}
                />
                <MetricRow
                    label="Produk Unik Dijual"
                    current={current_period.unique_items}
                    previous={previous_period.unique_items}
                    growthPercent={
                        previous_period.unique_items > 0
                            ? ((current_period.unique_items - previous_period.unique_items) / previous_period.unique_items) * 100
                            : 0
                    }
                />

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className={`text-2xl font-bold ${growth.revenue_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(growth.revenue_percent)}
                            </div>
                            <div className="text-xs text-gray-500">Pertumbuhan Hasil</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${growth.orders_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(growth.orders_percent)}
                            </div>
                            <div className="text-xs text-gray-500">Pertumbuhan Pesanan</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${growth.avg_order_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(growth.avg_order_percent)}
                            </div>
                            <div className="text-xs text-gray-500">Pertumbuhan AOV</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

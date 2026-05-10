'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesData {
    month: string;
    sales: number;
}

interface SalesChartProps {
    data: SalesData[];
}

export function SalesChart({ data }: SalesChartProps) {
    const formatCurrency = (value: number) => {
        return `RM ${(value / 1000).toFixed(0)}k`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trend Jualan 6 Bulan</CardTitle>
                <CardDescription>Prestasi jualan bulanan</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="month"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                tickFormatter={formatCurrency}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px',
                                }}
                                formatter={(value) => [`RM ${Number(value ?? 0).toLocaleString()}`, 'Jualan']}
                            />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ fill: 'hsl(var(--primary))' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

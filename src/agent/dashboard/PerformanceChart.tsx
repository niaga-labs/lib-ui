'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PerformanceData {
    month: string;
    sales: number;
    target?: number;
}

interface PerformanceChartProps {
    data: PerformanceData[];
    targetAmount?: number;
    chartType?: 'line' | 'bar';
}

export function PerformanceChart({ data, targetAmount, chartType = 'line' }: PerformanceChartProps) {
    const formatCurrency = (value: number) => {
        return `RM ${(value / 1000).toFixed(0)}k`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Prestasi Jualan</CardTitle>
                <CardDescription>Jualan 6 bulan lepas</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' ? (
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
                                <Legend />
                                {targetAmount && (
                                    <ReferenceLine
                                        y={targetAmount}
                                        stroke="hsl(var(--destructive))"
                                        strokeDasharray="5 5"
                                        label={{ value: 'Target', position: 'right' }}
                                    />
                                )}
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={{ fill: 'hsl(var(--primary))' }}
                                    name="Jualan"
                                />
                            </LineChart>
                        ) : (
                            <BarChart data={data}>
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
                                <Legend />
                                {targetAmount && (
                                    <ReferenceLine
                                        y={targetAmount}
                                        stroke="hsl(var(--destructive))"
                                        strokeDasharray="5 5"
                                        label={{ value: 'Target', position: 'right' }}
                                    />
                                )}
                                <Bar
                                    dataKey="sales"
                                    fill="hsl(var(--primary))"
                                    radius={[4, 4, 0, 0]}
                                    name="Jualan"
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

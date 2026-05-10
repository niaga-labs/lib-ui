'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Badge } from '../../primitives/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../primitives/select';
import { useState } from 'react';

interface Commission {
    id: string;
    orderNumber: string;
    date: string;
    orderTotal: number;
    rate: number;
    commission: number;
    status: 'pending' | 'approved' | 'paid';
}

interface CommissionTableProps {
    commissions: Commission[];
}

export function CommissionTable({ commissions }: CommissionTableProps) {
    const [statusFilter, setStatusFilter] = useState('all');

    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Pending', variant: 'secondary' as const },
            approved: { label: 'Diluluskan', variant: 'default' as const },
            paid: { label: 'Dibayar', variant: 'success' as const },
        };
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    };

    const filteredCommissions = commissions.filter(c =>
        statusFilter === 'all' || c.status === statusFilter
    );

    // Group by month
    const groupedByMonth = filteredCommissions.reduce((acc, commission) => {
        const month = new Date(commission.date).toLocaleDateString('ms-MY', {
            year: 'numeric',
            month: 'long',
        });
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(commission);
        return acc;
    }, {} as Record<string, Commission[]>);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sejarah Komisen</h3>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Diluluskan</SelectItem>
                        <SelectItem value="paid">Dibayar</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Monthly Groups */}
            {Object.entries(groupedByMonth).map(([month, monthCommissions]) => {
                const monthTotal = monthCommissions.reduce((sum, c) => sum + c.commission, 0);

                return (
                    <Card key={month}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{month}</CardTitle>
                                    <CardDescription>{monthCommissions.length} transaksi</CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Jumlah</p>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(monthTotal)}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3 font-medium">No. Pesanan</th>
                                            <th className="text-left p-3 font-medium">Tarikh</th>
                                            <th className="text-right p-3 font-medium">Jumlah Pesanan</th>
                                            <th className="text-center p-3 font-medium">Rate</th>
                                            <th className="text-right p-3 font-medium">Komisen</th>
                                            <th className="text-center p-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthCommissions.map((commission) => (
                                            <tr key={commission.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3 font-medium">{commission.orderNumber}</td>
                                                <td className="p-3 text-muted-foreground">
                                                    {new Date(commission.date).toLocaleDateString('ms-MY')}
                                                </td>
                                                <td className="p-3 text-right">
                                                    {formatCurrency(commission.orderTotal)}
                                                </td>
                                                <td className="p-3 text-center">{commission.rate}%</td>
                                                <td className="p-3 text-right font-semibold text-green-600">
                                                    {formatCurrency(commission.commission)}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <Badge variant={getStatusBadge(commission.status).variant}>
                                                        {getStatusBadge(commission.status).label}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

            {filteredCommissions.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <p>Tiada komisen dijumpai</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

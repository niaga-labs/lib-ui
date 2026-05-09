import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Badge } from '../../primitives/badge';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ms } from 'date-fns/locale';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    date: string;
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    commission: number;
}

interface RecentOrdersTableProps {
    orders: Order[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    const router = useRouter();

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Menunggu', variant: 'secondary' as const },
            processing: { label: 'Diproses', variant: 'default' as const },
            completed: { label: 'Selesai', variant: 'success' as const },
            cancelled: { label: 'Dibatal', variant: 'destructive' as const },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <Badge variant={config.variant}>
                {config.label}
            </Badge>
        );
    };

    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    if (orders.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pesanan Terkini</CardTitle>
                    <CardDescription>10 pesanan terkini yang anda submit</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Tiada pesanan lagi</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pesanan Terkini</CardTitle>
                <CardDescription>10 pesanan terkini yang anda submit</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">No. Pesanan</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Pelanggan</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tarikh</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Jumlah</th>
                                <th className="text-center p-3 text-sm font-medium text-muted-foreground">Status</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Komisen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => router.push(`/agent/orders/${order.id}`)}
                                >
                                    <td className="p-3">
                                        <span className="font-medium text-sm">{order.orderNumber}</span>
                                    </td>
                                    <td className="p-3">
                                        <span className="text-sm">{order.customerName}</span>
                                    </td>
                                    <td className="p-3">
                                        <span className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(order.date), { addSuffix: true, locale: ms })}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className="text-sm font-medium">{formatCurrency(order.total)}</span>
                                    </td>
                                    <td className="p-3 text-center">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className="text-sm font-semibold text-green-600">
                                            {formatCurrency(order.commission)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

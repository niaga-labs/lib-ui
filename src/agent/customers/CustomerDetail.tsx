import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Badge } from '../../primitives/badge';
import { Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign } from 'lucide-react';

interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    postcode?: string;
    state?: string;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: string;
    createdAt: string;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    status: string;
    commission: number;
}

interface CustomerDetailProps {
    customer: Customer;
    orders: Order[];
}

export function CustomerDetail({ customer, orders }: CustomerDetailProps) {
    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Menunggu', variant: 'secondary' as const },
            processing: { label: 'Diproses', variant: 'default' as const },
            completed: { label: 'Selesai', variant: 'success' as const },
            cancelled: { label: 'Dibatal', variant: 'destructive' as const },
        };
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    };

    return (
        <div className="space-y-6">
            {/* Customer Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{customer.name}</CardTitle>
                    <CardDescription>Maklumat Pelanggan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Telefon</p>
                                <p className="font-medium">{customer.phone}</p>
                            </div>
                        </div>

                        {customer.email && (
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{customer.email}</p>
                                </div>
                            </div>
                        )}

                        {customer.address && (
                            <div className="flex items-center gap-3 md:col-span-2">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Alamat</p>
                                    <p className="font-medium">
                                        {customer.address}, {customer.city} {customer.postcode}, {customer.state}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pelanggan Sejak</p>
                                <p className="font-medium">
                                    {new Date(customer.createdAt).toLocaleDateString('ms-MY')}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pesanan</p>
                                <p className="text-2xl font-bold">{customer.totalOrders}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Belanja</p>
                                <p className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Purata Pesanan</p>
                                <p className="text-2xl font-bold">{formatCurrency(customer.averageOrderValue)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Order History */}
            <Card>
                <CardHeader>
                    <CardTitle>Sejarah Pesanan</CardTitle>
                    <CardDescription>{orders.length} pesanan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium">No. Pesanan</th>
                                    <th className="text-left p-3 font-medium">Tarikh</th>
                                    <th className="text-right p-3 font-medium">Jumlah</th>
                                    <th className="text-center p-3 font-medium">Status</th>
                                    <th className="text-right p-3 font-medium">Komisen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-muted/50">
                                        <td className="p-3 font-medium">{order.orderNumber}</td>
                                        <td className="p-3 text-muted-foreground">
                                            {new Date(order.date).toLocaleDateString('ms-MY')}
                                        </td>
                                        <td className="p-3 text-right font-semibold">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <Badge variant={getStatusBadge(order.status).variant}>
                                                {getStatusBadge(order.status).label}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right text-green-600 font-semibold">
                                            {formatCurrency(order.commission)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Tiada pesanan lagi</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

import { useState } from 'react';
import { Card, CardContent } from '../../primitives/card';
import { Input } from '../../primitives/input';
import { Button } from '../../primitives/button';
import { Search, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
}

interface CustomersTableProps {
    customers: Customer[];
    onAddCustomer?: () => void;
}

export function CustomersTable({ customers, onAddCustomer }: CustomersTableProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Search and Add */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari nama, telefon, atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {onAddCustomer && (
                    <Button onClick={onAddCustomer} className="gap-2">
                        <UserPlus className="h-4 w-4" />
                        Tambah Pelanggan
                    </Button>
                )}
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-4 font-medium">Nama</th>
                                    <th className="text-left p-4 font-medium">Telefon</th>
                                    <th className="text-left p-4 font-medium">Email</th>
                                    <th className="text-right p-4 font-medium">Total Pesanan</th>
                                    <th className="text-right p-4 font-medium">Total Belanja</th>
                                    <th className="text-left p-4 font-medium">Pesanan Terakhir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => router.push(`/agent/customers/${customer.id}`)}
                                    >
                                        <td className="p-4 font-medium">{customer.name}</td>
                                        <td className="p-4 text-muted-foreground">{customer.phone}</td>
                                        <td className="p-4 text-muted-foreground">{customer.email || '-'}</td>
                                        <td className="p-4 text-right">{customer.totalOrders}</td>
                                        <td className="p-4 text-right font-semibold">
                                            {formatCurrency(customer.totalSpent)}
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {customer.lastOrderDate
                                                ? new Date(customer.lastOrderDate).toLocaleDateString('ms-MY')
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Tiada pelanggan dijumpai</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Input } from '../../primitives/input';
import { Label } from '../../primitives/label';
import { Button } from '../../primitives/button';
import { Search } from 'lucide-react';
import { Card, CardContent } from '../../primitives/card';

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    postcode?: string;
    state?: string;
}

interface CustomerSearchProps {
    onSelect: (customer: Customer) => void;
}

export function CustomerSearch({ onSelect }: CustomerSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Customer[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Mock search function - replace with actual API call
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);

        // Simulate API call
        setTimeout(() => {
            const mockResults: Customer[] = [
                {
                    id: '1',
                    name: 'Ahmad bin Ali',
                    phone: '0123456789',
                    email: 'ahmad@example.com',
                    address: 'No 123, Jalan Bunga Raya',
                    city: 'Kuala Lumpur',
                    postcode: '50000',
                    state: 'Wilayah Persekutuan',
                },
                {
                    id: '2',
                    name: 'Siti Nurhaliza',
                    phone: '0198765432',
                    email: 'siti@example.com',
                    address: 'No 456, Taman Melati',
                    city: 'Petaling Jaya',
                    postcode: '46000',
                    state: 'Selangor',
                },
            ].filter(c =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.phone.includes(searchQuery)
            );

            setResults(mockResults);
            setIsSearching(false);
        }, 500);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="flex-1">
                    <Label htmlFor="search">Cari Pelanggan</Label>
                    <Input
                        id="search"
                        placeholder="Nama atau no. telefon pelanggan"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="mt-6"
                >
                    <Search className="h-4 w-4 mr-2" />
                    Cari
                </Button>
            </div>

            {results.length > 0 && (
                <div className="space-y-2">
                    <Label>Keputusan Carian</Label>
                    {results.map((customer) => (
                        <Card
                            key={customer.id}
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => onSelect(customer)}
                        >
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                                        {customer.email && (
                                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                                        )}
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Pilih
                                    </Button>
                                </div>
                                {customer.address && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {customer.address}, {customer.city} {customer.postcode}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {results.length === 0 && searchQuery && !isSearching && (
                <p className="text-sm text-muted-foreground text-center py-4">
                    Tiada pelanggan dijumpai
                </p>
            )}
        </div>
    );
}

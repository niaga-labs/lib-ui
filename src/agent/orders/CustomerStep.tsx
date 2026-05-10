'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Button } from '../../primitives/button';
import { CustomerSearch, type Customer } from './CustomerSearch';
import { CustomerForm } from './CustomerForm';
import { Check, UserPlus } from 'lucide-react';
import { Badge } from '../../primitives/badge';

interface CustomerStepProps {
    selectedCustomer: Customer | null;
    onSelectCustomer: (customer: Customer) => void;
    onNext: () => void;
}

export function CustomerStep({ selectedCustomer, onSelectCustomer, onNext }: CustomerStepProps) {
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

    const handleCustomerSubmit = (customer: Customer) => {
        onSelectCustomer(customer);
        setShowNewCustomerForm(false);
    };

    return (
        <div className="space-y-6">
            {!selectedCustomer ? (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih Pelanggan</CardTitle>
                            <CardDescription>
                                Cari pelanggan sedia ada atau tambah pelanggan baru
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CustomerSearch onSelect={onSelectCustomer} />

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Atau</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Tambah Pelanggan Baru
                            </Button>

                            {showNewCustomerForm && (
                                <div className="mt-6 p-4 border rounded-lg">
                                    <h3 className="font-semibold mb-4">Pelanggan Baru</h3>
                                    <CustomerForm
                                        onSubmit={handleCustomerSubmit}
                                        onCancel={() => setShowNewCustomerForm(false)}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            ) : (
                <>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-green-600" />
                                        Pelanggan Dipilih
                                    </CardTitle>
                                    <CardDescription>Maklumat pelanggan untuk pesanan ini</CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => onSelectCustomer(null!)}
                                >
                                    Tukar
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nama</p>
                                    <p className="font-medium">{selectedCustomer.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">No. Telefon</p>
                                    <p className="font-medium">{selectedCustomer.phone}</p>
                                </div>
                                {selectedCustomer.email && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{selectedCustomer.email}</p>
                                    </div>
                                )}
                                {selectedCustomer.address && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Alamat</p>
                                        <p className="font-medium">
                                            {selectedCustomer.address}<br />
                                            {selectedCustomer.city} {selectedCustomer.postcode}<br />
                                            {selectedCustomer.state}
                                        </p>
                                    </div>
                                )}
                                {selectedCustomer.id.startsWith('new-') && (
                                    <Badge variant="secondary">Pelanggan Baru</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Button onClick={onNext} className="w-full" size="lg">
                        Seterusnya: Pilih Produk
                    </Button>
                </>
            )}
        </div>
    );
}

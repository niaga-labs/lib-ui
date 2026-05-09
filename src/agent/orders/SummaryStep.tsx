import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Button } from '../../primitives/button';
import { Label } from '../../primitives/label';
import { Textarea } from '../../primitives/textarea';
import { PaymentMethodSelect } from './PaymentMethodSelect';
import type { Customer } from './CustomerSearch';
import type { OrderItem } from './OrderItemsList';

interface SummaryStepProps {
    customer: Customer;
    items: OrderItem[];
    paymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
    agentNotes: string;
    onAgentNotesChange: (notes: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export function SummaryStep({
    customer,
    items,
    paymentMethod,
    onPaymentMethodChange,
    agentNotes,
    onAgentNotesChange,
    onNext,
    onBack,
}: SummaryStepProps) {
    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = 15.00; // Fixed shipping for now
    const total = subtotal + shippingFee;

    return (
        <div className="space-y-6">
            {/* Customer Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Maklumat Pelanggan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Nama</p>
                            <p className="font-medium">{customer.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">No. Telefon</p>
                            <p className="font-medium">{customer.phone}</p>
                        </div>
                        {customer.email && (
                            <div className="col-span-2">
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{customer.email}</p>
                            </div>
                        )}
                        {customer.address && (
                            <div className="col-span-2">
                                <p className="text-sm text-muted-foreground">Alamat Penghantaran</p>
                                <p className="font-medium">
                                    {customer.address}, {customer.city} {customer.postcode}, {customer.state}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Order Items Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Item Pesanan ({items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start pb-3 border-b last:border-0">
                                <div className="flex-1">
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.color}
                                        {item.size && ` • ${item.size}`}
                                        {item.productType === 'fabric'
                                            ? ` • ${item.meters} meter`
                                            : ` • Kuantiti: ${item.quantity}`}
                                    </p>
                                </div>
                                <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Penghantaran:</span>
                            <span className="font-medium">{formatCurrency(shippingFee)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                            <span className="font-semibold">Jumlah Keseluruhan:</span>
                            <span className="text-xl font-bold text-primary">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle>Kaedah Pembayaran</CardTitle>
                    <CardDescription>Pilih bagaimana customer akan membayar</CardDescription>
                </CardHeader>
                <CardContent>
                    <PaymentMethodSelect
                        value={paymentMethod}
                        onChange={onPaymentMethodChange}
                    />
                </CardContent>
            </Card>

            {/* Agent Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>Nota Agent (Dalaman)</CardTitle>
                    <CardDescription>Nota tambahan untuk kegunaan dalaman sahaja</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Cth: Customer minta penghantaran khas, pembungkusan hadiah, dsb..."
                        value={agentNotes}
                        onChange={(e) => onAgentNotesChange(e.target.value)}
                        rows={4}
                    />
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-4">
                <Button variant="outline" onClick={onBack}>
                    Kembali
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!paymentMethod}
                    className="flex-1"
                    size="lg"
                >
                    Seterusnya: Pengesahan
                </Button>
            </div>
        </div>
    );
}

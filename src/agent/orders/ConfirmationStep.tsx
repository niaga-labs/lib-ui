'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Button } from '../../primitives/button';
import { Checkbox } from '../../primitives/checkbox';
import { Label } from '../../primitives/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../primitives/alert';
import type { Customer } from './CustomerSearch';
import type { OrderItem } from './OrderItemsList';

interface ConfirmationStepProps {
    customer: Customer;
    items: OrderItem[];
    paymentMethod: string;
    agentNotes: string;
    onSubmit: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export function ConfirmationStep({
    customer,
    items,
    paymentMethod,
    agentNotes,
    onSubmit,
    onBack,
    isSubmitting,
}: ConfirmationStepProps) {
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = 15.00;
    const total = subtotal + shippingFee;

    const paymentMethodLabels = {
        online: 'Bayaran Online',
        cdm: 'Cash Deposit (CDM)',
        transfer: 'Bank Transfer',
        cod: 'Cash on Delivery',
    };

    return (
        <div className="space-y-6">
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Sila semak semua maklumat sebelum menghantar pesanan. Pesanan akan diproses selepas disahkan.
                </AlertDescription>
            </Alert>

            {/* Final Review */}
            <Card>
                <CardHeader>
                    <CardTitle>Semakan Akhir</CardTitle>
                    <CardDescription>Pastikan semua maklumat adalah betul</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Customer Info */}
                    <div>
                        <h4 className="font-semibold mb-2">Pelanggan</h4>
                        <div className="text-sm space-y-1 text-muted-foreground">
                            <p className="font-medium text-foreground">{customer.name}</p>
                            <p>{customer.phone}</p>
                            {customer.email && <p>{customer.email}</p>}
                            {customer.address && (
                                <p>{customer.address}, {customer.city} {customer.postcode}, {customer.state}</p>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h4 className="font-semibold mb-2">Item Pesanan</h4>
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>
                                        {item.productName} ({item.color}
                                        {item.size && `, ${item.size}`})
                                        {item.productType === 'fabric'
                                            ? ` - ${item.meters}m`
                                            : ` x${item.quantity}`}
                                    </span>
                                    <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                                </div>
                            ))}
                            <div className="pt-2 border-t">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Penghantaran:</span>
                                    <span>{formatCurrency(shippingFee)}</span>
                                </div>
                                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                    <span>Jumlah:</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h4 className="font-semibold mb-2">Kaedah Pembayaran</h4>
                        <p className="text-sm text-muted-foreground">
                            {paymentMethodLabels[paymentMethod as keyof typeof paymentMethodLabels]}
                        </p>
                    </div>

                    {/* Agent Notes */}
                    {agentNotes && (
                        <div>
                            <h4 className="font-semibold mb-2">Nota Agent</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {agentNotes}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2">
                <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label
                    htmlFor="terms"
                    className="text-sm leading-relaxed cursor-pointer"
                >
                    Saya sahkan bahawa semua maklumat adalah betul dan pelanggan bersetuju dengan terma dan syarat.
                </Label>
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
                <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
                    Kembali
                </Button>
                <Button
                    onClick={onSubmit}
                    disabled={!agreedToTerms || isSubmitting}
                    className="flex-1"
                    size="lg"
                >
                    {isSubmitting ? 'Menghantar...' : 'Hantar Pesanan'}
                </Button>
            </div>
        </div>
    );
}

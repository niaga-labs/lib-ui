'use client';

import { useState } from 'react';
import { Card, CardContent } from '../../primitives/card';
import { Progress } from '../../primitives/progress';
import { CustomerStep } from './CustomerStep';
import { ProductStep } from './ProductStep';
import { SummaryStep } from './SummaryStep';
import { ConfirmationStep } from './ConfirmationStep';
import { OrderSuccess } from './OrderSuccess';
import type { Customer } from './CustomerSearch';
import type { OrderItem } from './OrderItemsList';

const STEPS = [
    { id: 1, name: 'Pelanggan', description: 'Pilih atau tambah pelanggan' },
    { id: 2, name: 'Produk', description: 'Pilih produk untuk pesanan' },
    { id: 3, name: 'Ringkasan', description: 'Semak dan pilih pembayaran' },
    { id: 4, name: 'Pengesahan', description: 'Sahkan dan hantar pesanan' },
];

export function CreateOrderWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Order state
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [agentNotes, setAgentNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddItem = (item: OrderItem) => {
        setItems(prev => [...prev, item]);
    };

    const handleRemoveItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);

        // Simulate API call
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate order number
            const orderNum = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
            setOrderNumber(orderNum);
            setOrderSubmitted(true);

            // Optional: Save to API
            // const response = await agentApi.createOrder({
            //   customer,
            //   items,
            //   paymentMethod,
            //   agentNotes,
            // });

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Ralat semasa menghantar pesanan. Sila cuba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (currentStep / STEPS.length) * 100;

    if (orderSubmitted && customer) {
        return <OrderSuccess orderNumber={orderNumber} customerPhone={customer.phone} />;
    }

    return (
        <div className="space-y-6">
            {/* Progress Indicator */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            {STEPS.map((step) => (
                                <div
                                    key={step.id}
                                    className={`flex-1 ${step.id < STEPS.length ? 'mr-2' : ''
                                        }`}
                                >
                                    <div
                                        className={`font-medium ${currentStep === step.id
                                                ? 'text-primary'
                                                : currentStep > step.id
                                                    ? 'text-green-600'
                                                    : 'text-muted-foreground'
                                            }`}
                                    >
                                        Step {step.id}: {step.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground hidden sm:block">
                                        {step.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Step Content */}
            <div>
                {currentStep === 1 && (
                    <CustomerStep
                        selectedCustomer={customer}
                        onSelectCustomer={setCustomer}
                        onNext={() => setCurrentStep(2)}
                    />
                )}

                {currentStep === 2 && (
                    <ProductStep
                        items={items}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        onNext={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                    />
                )}

                {currentStep === 3 && customer && (
                    <SummaryStep
                        customer={customer}
                        items={items}
                        paymentMethod={paymentMethod}
                        onPaymentMethodChange={setPaymentMethod}
                        agentNotes={agentNotes}
                        onAgentNotesChange={setAgentNotes}
                        onNext={() => setCurrentStep(4)}
                        onBack={() => setCurrentStep(2)}
                    />
                )}

                {currentStep === 4 && customer && (
                    <ConfirmationStep
                        customer={customer}
                        items={items}
                        paymentMethod={paymentMethod}
                        agentNotes={agentNotes}
                        onSubmit={handleSubmitOrder}
                        onBack={() => setCurrentStep(3)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}

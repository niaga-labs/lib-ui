'use client';

import { useState } from 'react';
import { Button } from '../../primitives/button';
import { ProductSelector } from './ProductSelector';
import { ProductModal } from './ProductModal';
import { OrderItemsList, type OrderItem } from './OrderItemsList';

interface ProductStepProps {
    items: OrderItem[];
    onAddItem: (item: OrderItem) => void;
    onRemoveItem: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export function ProductStep({ items, onAddItem, onRemoveItem, onNext, onBack }: ProductStepProps) {
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectProduct = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAddToOrder = (itemData: Omit<OrderItem, 'id' | 'subtotal'>) => {
        const subtotal = itemData.productType === 'fabric'
            ? itemData.pricePerUnit * (itemData.meters || 0)
            : itemData.pricePerUnit * (itemData.quantity || 0);

        const newItem: OrderItem = {
            ...itemData,
            id: `item-${Date.now()}`,
            subtotal,
        };

        onAddItem(newItem);
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Product Selector - 2/3 width */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Pilih Produk</h3>
                    <ProductSelector onSelectProduct={handleSelectProduct} />
                </div>

                {/* Order Items List - 1/3 width */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Pesanan</h3>
                    <OrderItemsList
                        items={items}
                        onRemove={onRemoveItem}
                    />
                </div>
            </div>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                }}
                onAddToOrder={handleAddToOrder}
            />

            {/* Navigation Buttons */}
            <div className="flex gap-4">
                <Button variant="outline" onClick={onBack}>
                    Kembali
                </Button>
                <Button
                    onClick={onNext}
                    disabled={items.length === 0}
                    className="flex-1"
                    size="lg"
                >
                    Seterusnya: Ringkasan & Pembayaran
                </Button>
            </div>
        </div>
    );
}

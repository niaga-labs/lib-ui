'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../primitives/dialog';
import { Button } from '../../primitives/button';
import { Label } from '../../primitives/label';
import { Input } from '../../primitives/input';
import { MeterInput } from './MeterInput';
import { SizeSelector } from './SizeSelector';
import { cn } from '../../lib/utils';
import type { OrderItem } from './OrderItemsList';

interface Product {
    id: string;
    name: string;
    type: 'fabric' | 'ready-made';
    pricePerUnit: number;
    colors: string[];
    sizes?: { size: string; stock: number }[];
    image?: string;
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToOrder: (item: Omit<OrderItem, 'id' | 'subtotal'>) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToOrder }: ProductModalProps) {
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [meters, setMeters] = useState(1);
    const [quantity, setQuantity] = useState(1);

    const handleReset = () => {
        setSelectedColor('');
        setSelectedSize('');
        setMeters(1);
        setQuantity(1);
    };

    const handleAdd = () => {
        if (!product) return;

        if (!selectedColor) {
            alert('Sila pilih warna');
            return;
        }

        if (product.type === 'ready-made' && !selectedSize) {
            alert('Sila pilih saiz');
            return;
        }

        const item: Omit<OrderItem, 'id' | 'subtotal'> = {
            productId: product.id,
            productName: product.name,
            productType: product.type,
            color: selectedColor,
            pricePerUnit: product.pricePerUnit,
            ...(product.type === 'fabric'
                ? { meters }
                : { size: selectedSize, quantity }),
        };

        onAddToOrder(item);
        handleReset();
        onClose();
    };

    const calculatePrice = () => {
        if (!product) return 0;
        return product.type === 'fabric'
            ? product.pricePerUnit * meters
            : product.pricePerUnit * quantity;
    };

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>
                        {product.type === 'fabric' ? 'Kain' : 'Ready-made'} - RM {product.pricePerUnit.toFixed(2)}
                        {product.type === 'fabric' && '/meter'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Color Selection */}
                    <div>
                        <Label>Warna <span className="text-destructive">*</span></Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={cn(
                                        'px-4 py-2 rounded-lg border-2 transition-all',
                                        selectedColor === color
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border hover:border-primary'
                                    )}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fabric: Meter Input */}
                    {product.type === 'fabric' && (
                        <MeterInput value={meters} onChange={setMeters} min={1} max={50} />
                    )}

                    {/* Ready-made: Size and Quantity */}
                    {product.type === 'ready-made' && product.sizes && (
                        <>
                            <SizeSelector
                                sizes={product.sizes}
                                selectedSize={selectedSize}
                                onSelect={setSelectedSize}
                            />

                            <div>
                                <Label htmlFor="quantity">Kuantiti</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="w-32"
                                />
                            </div>
                        </>
                    )}

                    {/* Price Calculation */}
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Harga:</span>
                            <span className="text-2xl font-bold">
                                RM {calculatePrice().toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button onClick={handleAdd} className="flex-1">
                            Tambah ke Pesanan
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

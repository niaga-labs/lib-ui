import { Card, CardContent } from '../../primitives/card';
import { Button } from '../../primitives/button';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '../../primitives/scroll-area';

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productType: 'fabric' | 'ready-made';
    color: string;
    size?: string;
    quantity?: number;
    meters?: number;
    pricePerUnit: number;
    subtotal: number;
}

interface OrderItemsListProps {
    items: OrderItem[];
    onRemove: (id: string) => void;
    onEdit?: (id: string) => void;
}

export function OrderItemsList({ items, onRemove, onEdit }: OrderItemsListProps) {
    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.subtotal, 0);
    };

    if (items.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <p>Tiada item dalam pesanan</p>
                    <p className="text-sm mt-1">Tambah produk untuk mula</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Item Pesanan ({items.length})</h3>

                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.productName}</p>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                        <span className="px-2 py-0.5 bg-background rounded">
                                            {item.color}
                                        </span>
                                        {item.size && (
                                            <span className="px-2 py-0.5 bg-background rounded">
                                                {item.size}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 text-sm">
                                        {item.productType === 'fabric' ? (
                                            <span>{item.meters} meter × {formatCurrency(item.pricePerUnit)}/m</span>
                                        ) : (
                                            <span>{item.quantity} × {formatCurrency(item.pricePerUnit)}</span>
                                        )}
                                    </div>
                                    <p className="font-semibold mt-1">
                                        {formatCurrency(item.subtotal)}
                                    </p>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemove(item.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Subtotal:</span>
                        <span className="text-xl font-bold">
                            {formatCurrency(calculateTotal())}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

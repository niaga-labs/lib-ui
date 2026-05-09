import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Badge } from '../../primitives/badge';
import { Package } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    category: string;
    quantitySold: number;
    revenue: number;
}

interface TopProductsProps {
    products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const topProducts = products.slice(0, 5);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 5 Produk Terjual</CardTitle>
                <CardDescription>Produk paling laris</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <span className="font-bold text-lg text-primary">#{index + 1}</span>
                            </div>

                            <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">{product.quantitySold} unit</p>
                                <p className="text-sm text-green-600">{formatCurrency(product.revenue)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Tiada data produk</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

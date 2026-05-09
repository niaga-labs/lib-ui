import { useState } from 'react';
import { Input } from '../../primitives/input';
import { Button } from '../../primitives/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../primitives/select';
import { Search, Package } from 'lucide-react';
import { Card, CardContent } from '../../primitives/card';
import { Badge } from '../../primitives/badge';

interface Product {
    id: string;
    name: string;
    type: 'fabric' | 'ready-made';
    category: string;
    pricePerUnit: number;
    colors: string[];
    sizes?: { size: string; stock: number }[];
    image?: string;
}

interface ProductSelectorProps {
    onSelectProduct: (product: Product) => void;
}

export function ProductSelector({ onSelectProduct }: ProductSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');

    // Mock products - replace with API call
    const [products] = useState<Product[]>([
        {
            id: '1',
            name: 'Kain Batik Premium',
            type: 'fabric',
            category: 'Batik',
            pricePerUnit: 45.00,
            colors: ['Merah', 'Biru', 'Hijau'],
        },
        {
            id: '2',
            name: 'Kain Songket Sutera',
            type: 'fabric',
            category: 'Songket',
            pricePerUnit: 120.00,
            colors: ['Emas', 'Perak', 'Merah'],
        },
        {
            id: '3',
            name: 'Baju Kurung Moden',
            type: 'ready-made',
            category: 'Baju Kurung',
            pricePerUnit: 180.00,
            colors: ['Hitam', 'Navy', 'Maroon'],
            sizes: [
                { size: 'S', stock: 5 },
                { size: 'M', stock: 8 },
                { size: 'L', stock: 3 },
                { size: 'XL', stock: 0 },
            ],
        },
        {
            id: '4',
            name: 'Jubah Lelaki',
            type: 'ready-made',
            category: 'Jubah',
            pricePerUnit: 220.00,
            colors: ['Putih', 'Hitam', 'Abu-abu'],
            sizes: [
                { size: 'M', stock: 4 },
                { size: 'L', stock: 6 },
                { size: 'XL', stock: 2 },
                { size: 'XXL', stock: 1 },
            ],
        },
    ]);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesType = selectedType === 'all' || product.type === selectedType;

        return matchesSearch && matchesCategory && matchesType;
    });

    const categories = Array.from(new Set(products.map(p => p.category)));

    const formatCurrency = (amount: number) => {
        return `RM ${amount.toFixed(2)}`;
    };

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-2 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <Input
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="h-4 w-4" />}
                    />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Jenis</SelectItem>
                        <SelectItem value="fabric">Kain</SelectItem>
                        <SelectItem value="ready-made">Ready-made</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                    <Card
                        key={product.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => onSelectProduct(product)}
                    >
                        <CardContent className="p-4">
                            <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                                <Package className="h-12 w-12 text-muted-foreground" />
                            </div>

                            <h3 className="font-semibold mb-1">{product.name}</h3>

                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant={product.type === 'fabric' ? 'default' : 'secondary'}>
                                    {product.type === 'fabric' ? 'Kain' : 'Ready-made'}
                                </Badge>
                                <span className="text-sm text-muted-foreground">{product.category}</span>
                            </div>

                            <p className="text-lg font-bold text-primary">
                                {formatCurrency(product.pricePerUnit)}
                                {product.type === 'fabric' && <span className="text-sm font-normal">/meter</span>}
                            </p>

                            <div className="mt-2 flex gap-1">
                                {product.colors.slice(0, 3).map((color, idx) => (
                                    <div
                                        key={idx}
                                        className="w-6 h-6 rounded-full border-2 border-border bg-muted flex items-center justify-center text-xs"
                                        title={color}
                                    >
                                        {color.charAt(0)}
                                    </div>
                                ))}
                                {product.colors.length > 3 && (
                                    <div className="w-6 h-6 rounded-full border-2 border-border bg-muted flex items-center justify-center text-xs">
                                        +{product.colors.length - 3}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Tiada produk dijumpai</p>
                </div>
            )}
        </div>
    );
}

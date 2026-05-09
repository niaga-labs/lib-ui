import { Label } from '../../primitives/label';
import { Badge } from '../../primitives/badge';
import { cn } from '../../lib/utils';

interface Size {
    size: string;
    stock: number;
}

interface SizeSelectorProps {
    sizes: Size[];
    selectedSize: string;
    onSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
    return (
        <div className="space-y-2">
            <Label>Saiz</Label>
            <div className="flex flex-wrap gap-2">
                {sizes.map((item) => {
                    const isSelected = selectedSize === item.size;
                    const isOutOfStock = item.stock === 0;

                    return (
                        <button
                            key={item.size}
                            type="button"
                            onClick={() => !isOutOfStock && onSelect(item.size)}
                            disabled={isOutOfStock}
                            className={cn(
                                'relative px-4 py-2 rounded-lg border-2 transition-all',
                                'hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed',
                                isSelected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border'
                            )}
                        >
                            <span className="font-medium">{item.size}</span>
                            {isOutOfStock && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 text-xs px-1"
                                >
                                    Habis
                                </Badge>
                            )}
                            {!isOutOfStock && item.stock < 5 && (
                                <span className="absolute -top-2 -right-2 text-xs bg-amber-500 text-white px-1.5 rounded-full">
                                    {item.stock}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

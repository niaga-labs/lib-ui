import { useState } from 'react';
import { Input } from '../../primitives/input';
import { Label } from '../../primitives/label';
import { Minus, Plus } from 'lucide-react';
import { Button } from '../../primitives/button';

interface MeterInputProps {
    value: number;
    onChange: (value: number);
    min?: number;
    max?: number;
    step?: number;
}

export function MeterInput({ value, onChange, min = 1, max = 100, step = 0.5 }: MeterInputProps) {
    const handleIncrement = () => {
        const newValue = Math.min(value + step, max);
        onChange(Number(newValue.toFixed(1)));
    };

    const handleDecrement = () => {
        const newValue = Math.max(value - step, min);
        onChange(Number(newValue.toFixed(1)));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= min && val <= max) {
            onChange(val);
        }
    };

    return (
        <div className="space-y-2">
            <Label>Meter</Label>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={value <= min}
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <Input
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    min={min}
                    max={max}
                    step={step}
                    className="text-center"
                />

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={value >= max}
                >
                    <Plus className="h-4 w-4" />
                </Button>

                <span className="text-sm text-muted-foreground min-w-[3rem]">meter</span>
            </div>
        </div>
    );
}

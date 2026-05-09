'use client';

import { useState, useRef, useEffect } from 'react';
import { Scan, X } from 'lucide-react';

interface ItemScannerProps {
    onScan: (sku: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function ItemScanner({ onScan, placeholder = 'Scan or enter SKU...', autoFocus = true }: ItemScannerProps) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onScan(value.trim());
            setValue('');
            inputRef.current?.focus();
        }
    };

    const handleClear = () => {
        setValue('');
        inputRef.current?.focus();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Item SKU/Barcode
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Scan className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="scanner-input pl-12 pr-12"
                    placeholder={placeholder}
                    autoComplete="off"
                    inputMode="text"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
            <button
                type="submit"
                className="w-full bg-warehouse-primary text-white py-3 px-4 rounded-lg font-semibold touch-target hover:bg-blue-700 transition-colors"
            >
                Scan Item
            </button>
        </form>
    );
}

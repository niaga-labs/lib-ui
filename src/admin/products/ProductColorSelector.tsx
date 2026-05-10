'use client';

import { useState, useEffect } from 'react';
import type { ProductColor, CreateColorInput, ProductColorApi } from './products';

export interface ProductColorSelectorProps {
    api: ProductColorApi;
    productId?: string;
    selectedColorIds: string[];
    onChange: (colorIds: string[]) => void;
}

const COLOR_FAMILIES = [
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'brown', label: 'Brown / Earth' },
    { value: 'neutral', label: 'Neutral / Grey' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'multi', label: 'Multi-color' },
];

export default function ProductColorSelector({
    api,
    productId,
    selectedColorIds,
    onChange,
}: ProductColorSelectorProps) {
    const [availableColors, setAvailableColors] = useState<ProductColor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newColor, setNewColor] = useState<CreateColorInput>({
        name: '',
        nameMalay: '',
        hexCode: '#000000',
        colorFamily: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchColors() {
            try {
                setLoading(true);
                const colors = await api.getColors();
                setAvailableColors(colors.filter(c => c.isActive));
            } catch (err) {
                console.error('Failed to fetch colors:', err);
                setError('Failed to load colors');
            } finally {
                setLoading(false);
            }
        }
        fetchColors();
    }, [api]);

    useEffect(() => {
        async function fetchProductColors() {
            if (productId) {
                try {
                    const colors = await api.getProductColors(productId);
                    onChange(colors.map(c => c.id));
                } catch (err) {
                    console.error('Failed to fetch product colors:', err);
                }
            }
        }
        fetchProductColors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const toggleColor = (colorId: string) => {
        if (selectedColorIds.includes(colorId)) {
            onChange(selectedColorIds.filter(id => id !== colorId));
        } else {
            onChange([...selectedColorIds, colorId]);
        }
    };

    const isSelected = (colorId: string) => selectedColorIds.includes(colorId);

    const handleAddColor = async () => {
        if (!newColor.name || !newColor.hexCode) return;

        setSaving(true);
        try {
            const created = await api.createColor(newColor);
            setAvailableColors([...availableColors, created]);
            onChange([...selectedColorIds, created.id]);
            setNewColor({ name: '', nameMalay: '', hexCode: '#000000', colorFamily: '' });
            setShowAddForm(false);
        } catch (err) {
            console.error('Failed to create color:', err);
            setError('Failed to create color');
        } finally {
            setSaving(false);
        }
    };

    const groupedColors = availableColors.reduce((acc, color) => {
        const family = color.colorFamily || 'Other';
        if (!acc[family]) {
            acc[family] = [];
        }
        acc[family].push(color);
        return acc;
    }, {} as Record<string, ProductColor[]>);

    const sortedFamilies = Object.keys(groupedColors).sort((a, b) => {
        const order = COLOR_FAMILIES.map(f => f.value);
        const aIdx = order.indexOf(a.toLowerCase());
        const bIdx = order.indexOf(b.toLowerCase());
        if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
    });

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {selectedColorIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 font-medium mb-2">
                        Selected Colors ({selectedColorIds.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedColorIds.map(colorId => {
                            const color = availableColors.find(c => c.id === colorId);
                            if (!color) return null;
                            return (
                                <span
                                    key={colorId}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-full text-sm border border-blue-200 shadow-sm"
                                >
                                    <span
                                        className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                                        style={{ backgroundColor: color.hexCode }}
                                    />
                                    <span className="font-medium">{color.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => toggleColor(colorId)}
                                        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Available Colors</p>
                </div>
                <div className="p-3 space-y-4 max-h-80 overflow-y-auto">
                    {sortedFamilies.map((family) => (
                        <div key={family}>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
                                {COLOR_FAMILIES.find(f => f.value.toLowerCase() === family.toLowerCase())?.label || family}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {groupedColors[family].map(color => (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => toggleColor(color.id)}
                                        className={`
                                            relative group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border-2 transition-all
                                            ${isSelected(color.id)
                                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'}
                                        `}
                                    >
                                        <span
                                            className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0 shadow-inner"
                                            style={{ backgroundColor: color.hexCode }}
                                        />
                                        <span className={`text-sm ${isSelected(color.id) ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                                            {color.name}
                                        </span>
                                        {isSelected(color.id) && (
                                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {availableColors.length === 0 && (
                        <div className="text-sm text-gray-500 text-center py-4">
                            No colors available. Add your first color below.
                        </div>
                    )}
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Color
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${showAddForm ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showAddForm && (
                    <div className="p-4 space-y-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color Name (English) *
                                </label>
                                <input
                                    type="text"
                                    value={newColor.name}
                                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                    placeholder="e.g. Navy Blue"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color Name (Malay)
                                </label>
                                <input
                                    type="text"
                                    value={newColor.nameMalay || ''}
                                    onChange={(e) => setNewColor({ ...newColor, nameMalay: e.target.value })}
                                    placeholder="e.g. Biru Tua"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color Code *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={newColor.hexCode}
                                        onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={newColor.hexCode}
                                        onChange={(e) => setNewColor({ ...newColor, hexCode: e.target.value })}
                                        placeholder="#000000"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color Family
                                </label>
                                <select
                                    value={newColor.colorFamily || ''}
                                    onChange={(e) => setNewColor({ ...newColor, colorFamily: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select family...</option>
                                    {COLOR_FAMILIES.map(family => (
                                        <option key={family.value} value={family.value}>
                                            {family.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewColor({ name: '', nameMalay: '', hexCode: '#000000', colorFamily: '' });
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddColor}
                                disabled={!newColor.name || !newColor.hexCode || saving}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Color
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500">
                Select the colors that are available for this product. These colors will be shown as filter options in the storefront.
            </p>
        </div>
    );
}

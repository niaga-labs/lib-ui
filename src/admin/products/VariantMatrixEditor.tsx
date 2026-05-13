'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, GripVertical, Edit2, Save, X, RefreshCw, DollarSign, Package } from 'lucide-react';

// Price input component that handles decimal input smoothly
function PriceInput({
    value,
    placeholder,
    onChange,
}: {
    value: number | null;
    placeholder: string;
    onChange: (value: number | null) => void;
}) {
    const [localValue, setLocalValue] = useState<string>(value?.toString() ?? '');
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync from parent when value changes externally
    useEffect(() => {
        const currentAsNumber = localValue === '' ? null : parseFloat(localValue);
        if (currentAsNumber !== value) {
            setLocalValue(value?.toString() ?? '');
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow empty, numbers, and one decimal point
        if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
            setLocalValue(inputValue);
        }
    };

    const handleBlur = () => {
        // Convert to number on blur
        if (localValue === '' || localValue === '.') {
            onChange(null);
            setLocalValue('');
        } else {
            const numValue = parseFloat(localValue);
            if (!isNaN(numValue)) {
                onChange(numValue);
                // Format to 2 decimal places if needed
                setLocalValue(numValue.toString());
            } else {
                onChange(null);
                setLocalValue('');
            }
        }
    };

    return (
        <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
    );
}

// Types
export interface VariantOption {
    id: string;
    name: string;
    values: string[];
}

export interface VariantData {
    id?: string;
    sku: string;
    name: string;
    price: number | null;
    stockQuantity: number;
    weight: number | null;
    image: string;
    isActive: boolean;
    attributes: Record<string, string>;
}

interface VariantMatrixEditorProps {
    productId?: string;
    productName: string;
    productImage?: string;  // Main product image as fallback for variants
    basePrice: number;
    baseSku: string;
    initialOptions?: VariantOption[];
    initialVariants?: VariantData[];
    onChange: (options: VariantOption[], variants: VariantData[], deletedVariantIds?: string[]) => void;
}

// Predefined option templates — generic across tenants. Vertical-specific
// presets (e.g. batik patterns, songket weaves) belong in a tenant config,
// not baked into lib-ui.
const OPTION_TEMPLATES = {
    Size: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    Color: ['Red', 'Blue', 'Green', 'Black', 'White', 'Navy', 'Brown'],
    Material: ['Cotton', 'Silk', 'Polyester', 'Blend'],
};

// Standard size order for sorting
const SIZE_ORDER = ['XXS', '2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL', '5XL', '6XL'];

// Get size sort index
const getSizeSortIndex = (size: string): number => {
    const idx = SIZE_ORDER.indexOf(size.toUpperCase());
    return idx === -1 ? 999 : idx; // Unknown sizes go to the end
};

// Sort variants by size attribute
const sortVariantsBySize = (variants: VariantData[]): VariantData[] => {
    return [...variants].sort((a, b) => {
        // Find size attribute (case-insensitive)
        const aSize = a.attributes['Size'] || a.attributes['size'] || a.attributes['Saiz'] || '';
        const bSize = b.attributes['Size'] || b.attributes['size'] || b.attributes['Saiz'] || '';

        const aIdx = getSizeSortIndex(aSize);
        const bIdx = getSizeSortIndex(bSize);

        if (aIdx !== bIdx) return aIdx - bIdx;

        // If same size or no size, sort by name
        return a.name.localeCompare(b.name);
    });
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Parse option values from input string
// Splits by comma or "/" to handle different input formats
const parseOptionValues = (input: string): string[] => {
    return input
        .split(/[,\/]/) // Split by comma or forward slash
        .map(v => v.trim())
        .filter(v => v && v.length > 0);
};

// Generate SKU from attributes - use first 3 chars + hash for uniqueness
const generateSku = (baseSku: string, attributes: Record<string, string>): string => {
    const values = Object.values(attributes);
    // Create a more unique suffix using first 3 chars of each value
    const suffix = values
        .map(v => v.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, ''))
        .join('-');
    // Add a short hash if there are multiple attributes to ensure uniqueness
    const hash = values.length > 1
        ? '-' + Math.abs(values.join('').split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) % 1000).toString().padStart(3, '0')
        : '';
    return `${baseSku}-${suffix}${hash}`;
};

// Generate variant name from attributes
const generateVariantName = (attributes: Record<string, string>): string => {
    return Object.values(attributes).join(' / ');
};

// Generate all combinations of option values
const generateCombinations = (options: VariantOption[]): Record<string, string>[] => {
    if (options.length === 0) return [];

    const result: Record<string, string>[] = [];

    const generate = (index: number, current: Record<string, string>) => {
        if (index === options.length) {
            result.push({ ...current });
            return;
        }

        const option = options[index];
        for (const value of option.values) {
            current[option.name] = value;
            generate(index + 1, current);
        }
    };

    generate(0, {});
    return result;
};

export default function VariantMatrixEditor({
    productId,
    productName,
    productImage,
    basePrice,
    baseSku,
    initialOptions = [],
    initialVariants = [],
    onChange,
}: VariantMatrixEditorProps) {
    const [options, setOptions] = useState<VariantOption[]>(initialOptions);
    const [variants, setVariants] = useState<VariantData[]>(initialVariants);
    const [deletedVariantIds, setDeletedVariantIds] = useState<string[]>([]);
    const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

    // Update state when initial props change (async loading)
    useEffect(() => {
        if (initialOptions.length > 0) {
            setOptions(initialOptions);
        }
    }, [initialOptions]);

    useEffect(() => {
        if (initialVariants.length > 0) {
            setVariants(initialVariants);
        }
    }, [initialVariants]);
    const [newOptionName, setNewOptionName] = useState('');
    const [newOptionValues, setNewOptionValues] = useState('');
    const [showAddOption, setShowAddOption] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
    const [bulkEditMode, setBulkEditMode] = useState<'price' | 'stock' | null>(null);
    const [bulkValue, setBulkValue] = useState('');

    // Notify parent of changes
    useEffect(() => {
        onChange(options, variants, deletedVariantIds);
    }, [options, variants, deletedVariantIds]);

    // Generate variants when options change
    const regenerateVariants = useCallback(() => {
        const combinations = generateCombinations(options);

        const newVariants: VariantData[] = combinations.map(attrs => {
            // Check if variant already exists
            const existingKey = JSON.stringify(attrs);
            const existing = variants.find(v => JSON.stringify(v.attributes) === existingKey);

            if (existing) {
                return existing;
            }

            return {
                id: generateId(),
                sku: generateSku(baseSku || 'SKU', attrs),
                name: generateVariantName(attrs),
                price: null, // null means use base price
                stockQuantity: 0,
                weight: null,
                image: '',
                isActive: true,
                attributes: attrs,
            };
        });

        setVariants(newVariants);
    }, [options, baseSku]);

    // Add new option
    const handleAddOption = () => {
        if (!newOptionName.trim()) return;

        // Parse values using helper (splits by comma or /)
        const values = parseOptionValues(newOptionValues);

        if (values.length === 0) return;

        const newOption: VariantOption = {
            id: generateId(),
            name: newOptionName.trim(),
            values,
        };

        setOptions([...options, newOption]);
        setNewOptionName('');
        setNewOptionValues('');
        setShowAddOption(false);
    };

    // Use template for new option
    const handleUseTemplate = (templateName: string) => {
        setNewOptionName(templateName);
        setNewOptionValues(OPTION_TEMPLATES[templateName as keyof typeof OPTION_TEMPLATES].join(', '));
    };

    // Remove option
    const handleRemoveOption = (optionId: string) => {
        setOptions(options.filter(o => o.id !== optionId));
    };

    // Update option values
    const handleUpdateOptionValues = (optionId: string, values: string[]) => {
        setOptions(options.map(o =>
            o.id === optionId ? { ...o, values } : o
        ));
    };

    // Remove a single value from an option
    const handleRemoveOptionValue = (optionId: string, valueToRemove: string) => {
        setOptions(options.map(o => {
            if (o.id === optionId) {
                const newValues = o.values.filter(v => v !== valueToRemove);
                // If no values left, remove the entire option
                if (newValues.length === 0) {
                    return null;
                }
                return { ...o, values: newValues };
            }
            return o;
        }).filter((o): o is VariantOption => o !== null));
    };

    // Update single variant
    const handleUpdateVariant = (variantId: string, field: keyof VariantData, value: any) => {
        setVariants(variants.map(v =>
            v.id === variantId ? { ...v, [field]: value } : v
        ));
    };

    // Delete a variant
    const handleDeleteVariant = (variantId: string) => {
        const variantToDelete = variants.find(v => v.id === variantId);
        if (!variantToDelete) return;

        // Check if this is an existing variant (has a real UUID - 36 chars with dashes)
        const isExistingVariant = variantId && variantId.length === 36 && variantId.includes('-');

        if (isExistingVariant) {
            // Track for deletion from backend
            setDeletedVariantIds(prev => [...prev, variantId]);
        }

        // Remove from local state
        setVariants(variants.filter(v => v.id !== variantId));
        // Also remove from selection if selected
        setSelectedVariants(prev => {
            const newSet = new Set(prev);
            newSet.delete(variantId);
            return newSet;
        });
    };

    // Bulk delete selected variants
    const handleBulkDelete = () => {
        const variantsToDelete = variants.filter(v => selectedVariants.has(v.id!));

        // Track existing variants for backend deletion
        const existingVariantIds = variantsToDelete
            .filter(v => v.id && v.id.length === 36 && v.id.includes('-'))
            .map(v => v.id!);

        if (existingVariantIds.length > 0) {
            setDeletedVariantIds(prev => [...prev, ...existingVariantIds]);
        }

        // Remove from local state
        setVariants(variants.filter(v => !selectedVariants.has(v.id!)));
        setSelectedVariants(new Set());
    };

    // Bulk update selected variants
    const handleBulkUpdate = () => {
        if (!bulkEditMode || !bulkValue) return;

        const numValue = parseFloat(bulkValue);
        if (isNaN(numValue)) return;

        setVariants(variants.map(v => {
            if (selectedVariants.has(v.id!)) {
                if (bulkEditMode === 'price') {
                    return { ...v, price: numValue };
                } else if (bulkEditMode === 'stock') {
                    return { ...v, stockQuantity: Math.floor(numValue) };
                }
            }
            return v;
        }));

        setBulkEditMode(null);
        setBulkValue('');
        setSelectedVariants(new Set());
    };

    // Select all variants
    const handleSelectAll = () => {
        if (selectedVariants.size === variants.length) {
            setSelectedVariants(new Set());
        } else {
            setSelectedVariants(new Set(variants.map(v => v.id!)));
        }
    };

    // Toggle variant selection
    const handleToggleSelect = (variantId: string) => {
        const newSelected = new Set(selectedVariants);
        if (newSelected.has(variantId)) {
            newSelected.delete(variantId);
        } else {
            newSelected.add(variantId);
        }
        setSelectedVariants(newSelected);
    };

    // Auto-generate SKUs for all variants
    const handleAutoGenerateSkus = () => {
        setVariants(variants.map(v => ({
            ...v,
            sku: generateSku(baseSku || 'SKU', v.attributes),
        })));
    };

    // Set all prices to base price
    const handleSetAllToBasePrice = () => {
        setVariants(variants.map(v => ({
            ...v,
            price: null, // null means use base price
        })));
    };

    return (
        <div className="space-y-6">
            {/* Options Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Variant Options</h3>
                    {!showAddOption && options.length < 3 && (
                        <button
                            onClick={() => setShowAddOption(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Add option
                        </button>
                    )}
                </div>

                {/* Existing Options */}
                <div className="space-y-4">
                    {options.map((option, index) => (
                        <div key={option.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-gray-400 cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-gray-900">{option.name}</span>
                                    <span className="text-sm text-gray-500">({option.values.length} values)</span>
                                </div>
                                {editingOptionId === option.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={option.values.join(', ')}
                                            onChange={(e) => handleUpdateOptionValues(
                                                option.id,
                                                parseOptionValues(e.target.value)
                                            )}
                                            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                                            placeholder="Values (comma or / separated)"
                                        />
                                        <button
                                            onClick={() => setEditingOptionId(null)}
                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {option.values.map(value => (
                                            <span
                                                key={value}
                                                className="px-2 py-1 text-sm bg-white border border-gray-200 rounded flex items-center gap-1 group"
                                            >
                                                {value}
                                                <button
                                                    onClick={() => handleRemoveOptionValue(option.id, value)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                    title={`Remove ${value}`}
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                        <button
                                            onClick={() => setEditingOptionId(option.id)}
                                            className="p-1 text-gray-400 hover:text-gray-600"
                                            title="Edit values"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => handleRemoveOption(option.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add New Option */}
                {showAddOption && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Add Option</h4>
                            <button
                                onClick={() => setShowAddOption(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Templates */}
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-2">Quick add from template:</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(OPTION_TEMPLATES).map(template => (
                                    <button
                                        key={template}
                                        onClick={() => handleUseTemplate(template)}
                                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        {template}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Option name</label>
                                <input
                                    type="text"
                                    value={newOptionName}
                                    onChange={(e) => setNewOptionName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="e.g., Size, Color"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Values (comma or / separated)</label>
                                <input
                                    type="text"
                                    value={newOptionValues}
                                    onChange={(e) => setNewOptionValues(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="e.g., S, M, L, XL or 2.0m, 2.5m, 3.0m"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleAddOption}
                                disabled={!newOptionName.trim() || !newOptionValues.trim()}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                Add Option
                            </button>
                        </div>
                    </div>
                )}

                {options.length === 0 && !showAddOption && (
                    <div className="text-center py-8 text-gray-500">
                        <p className="mb-2">No variant options defined</p>
                        <p className="text-sm">Add options like Size or Color to create product variants</p>
                    </div>
                )}

                {/* Generate Variants Button */}
                {options.length > 0 && (
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            {variants.length > 0
                                ? `${variants.length} variants will be created`
                                : 'Click to generate variant combinations'}
                        </p>
                        <button
                            onClick={regenerateVariants}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {variants.length > 0 ? 'Regenerate Variants' : 'Generate Variants'}
                        </button>
                    </div>
                )}
            </div>

            {/* Variants Table */}
            {variants.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Bulk Actions */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Variants ({variants.length})
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleAutoGenerateSkus}
                                    className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Auto-generate SKUs
                                </button>
                                <button
                                    onClick={handleSetAllToBasePrice}
                                    className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Reset all to base price
                                </button>
                            </div>
                        </div>

                        {/* Bulk Edit Bar */}
                        {selectedVariants.size > 0 && (
                            <div className="mt-3 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">
                                    {selectedVariants.size} selected
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setBulkEditMode('price')}
                                        className="flex items-center gap-1 px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        <DollarSign className="w-3 h-3" />
                                        Set Price
                                    </button>
                                    <button
                                        onClick={() => setBulkEditMode('stock')}
                                        className="flex items-center gap-1 px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        <Package className="w-3 h-3" />
                                        Set Stock
                                    </button>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="flex items-center gap-1 px-2 py-1 text-sm bg-red-50 border border-red-300 text-red-700 rounded hover:bg-red-100"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                    </button>
                                </div>
                                {bulkEditMode && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={bulkValue}
                                            onChange={(e) => setBulkValue(e.target.value)}
                                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                                            placeholder={bulkEditMode === 'price' ? 'Price' : 'Qty'}
                                        />
                                        <button
                                            onClick={handleBulkUpdate}
                                            className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Apply
                                        </button>
                                        <button
                                            onClick={() => { setBulkEditMode(null); setBulkValue(''); }}
                                            className="p-1 text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Variants Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="w-10 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedVariants.size === variants.length && variants.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Variant
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        SKU
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Price (RM)
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Stock
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Active
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {sortVariantsBySize(variants).map(variant => (
                                    <tr
                                        key={variant.id}
                                        className={`hover:bg-gray-50 ${selectedVariants.has(variant.id!) ? 'bg-blue-50' : ''}`}
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedVariants.has(variant.id!)}
                                                onChange={() => handleToggleSelect(variant.id!)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                                    {variant.image || productImage ? (
                                                        <img
                                                            src={variant.image || productImage}
                                                            alt={variant.name}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{variant.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) => handleUpdateVariant(variant.id!, 'sku', e.target.value)}
                                                className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <PriceInput
                                                    value={variant.price}
                                                    placeholder={basePrice.toFixed(2)}
                                                    onChange={(newPrice) => handleUpdateVariant(variant.id!, 'price', newPrice)}
                                                />
                                                {variant.price === null && (
                                                    <span className="text-xs text-gray-400">(base)</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                value={variant.stockQuantity}
                                                onChange={(e) => handleUpdateVariant(
                                                    variant.id!,
                                                    'stockQuantity',
                                                    parseInt(e.target.value) || 0
                                                )}
                                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={variant.isActive}
                                                onChange={(e) => handleUpdateVariant(variant.id!, 'isActive', e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDeleteVariant(variant.id!)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete variant"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-600">
                                Total Stock: <span className="font-medium">{variants.reduce((sum, v) => sum + v.stockQuantity, 0)} units</span>
                            </div>
                            <div className="text-gray-600">
                                Active Variants: <span className="font-medium">{variants.filter(v => v.isActive).length} / {variants.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

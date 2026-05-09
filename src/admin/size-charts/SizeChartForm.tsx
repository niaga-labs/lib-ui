'use client';

import { useState, useEffect } from 'react';
import { PolarisCard, PolarisTextField, PolarisSelect } from '@niaga/lib-ui/admin/polaris';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface SizeChartFormProps {
    sizeChart?: {
        id?: string;
        name: string;
        gender: string;
        measurements: Record<string, Record<string, number>>;
        notes?: string;
        is_active: boolean;
    };
    onSave: (data: any) => void;
    saving?: boolean;
}

// Common measurement types
const MEASUREMENT_TYPES = [
    { value: 'bust', label: 'Bust/Chest (Dada)' },
    { value: 'waist', label: 'Waist (Pinggang)' },
    { value: 'hip', label: 'Hip (Pinggul)' },
    { value: 'length', label: 'Length (Panjang)' },
    { value: 'shoulder', label: 'Shoulder (Bahu)' },
    { value: 'sleeve', label: 'Sleeve (Lengan)' },
    { value: 'inseam', label: 'Inseam (Dalam Kaki)' },
];

// Common sizes
const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function SizeChartForm({ sizeChart, onSave, saving }: SizeChartFormProps) {
    const [name, setName] = useState(sizeChart?.name || '');
    const [gender, setGender] = useState(sizeChart?.gender || 'women');
    const [notes, setNotes] = useState(sizeChart?.notes || '');
    const [isActive, setIsActive] = useState(sizeChart?.is_active ?? true);

    // Modal states for replacing prompt()
    const [showAddSizeModal, setShowAddSizeModal] = useState(false);
    const [newSizeName, setNewSizeName] = useState('');
    const [showAddMeasurementModal, setShowAddMeasurementModal] = useState(false);
    const [selectedMeasurementIndex, setSelectedMeasurementIndex] = useState<number | null>(null);

    // Sizes (columns) - e.g., ['XS', 'S', 'M', 'L', 'XL']
    const [sizes, setSizes] = useState<string[]>(() => {
        if (sizeChart?.measurements) {
            return Object.keys(sizeChart.measurements);
        }
        return [...DEFAULT_SIZES];
    });

    // Measurement types (rows) - e.g., ['bust', 'waist', 'hip']
    const [measurementTypes, setMeasurementTypes] = useState<string[]>(() => {
        if (sizeChart?.measurements) {
            const firstSize = Object.keys(sizeChart.measurements)[0];
            if (firstSize) {
                return Object.keys(sizeChart.measurements[firstSize]);
            }
        }
        return ['bust', 'waist', 'hip'];
    });

    // Values matrix - { [size]: { [measurementType]: value } }
    const [values, setValues] = useState<Record<string, Record<string, string>>>(() => {
        if (sizeChart?.measurements) {
            const converted: Record<string, Record<string, string>> = {};
            for (const size of Object.keys(sizeChart.measurements)) {
                converted[size] = {};
                for (const type of Object.keys(sizeChart.measurements[size])) {
                    converted[size][type] = String(sizeChart.measurements[size][type] || '');
                }
            }
            return converted;
        }
        // Initialize empty values
        const initial: Record<string, Record<string, string>> = {};
        for (const size of DEFAULT_SIZES) {
            initial[size] = {};
            for (const type of ['bust', 'waist', 'hip']) {
                initial[size][type] = '';
            }
        }
        return initial;
    });

    const handleValueChange = (size: string, type: string, value: string) => {
        setValues(prev => ({
            ...prev,
            [size]: {
                ...prev[size],
                [type]: value,
            },
        }));
    };

    const addSize = () => {
        setNewSizeName('');
        setShowAddSizeModal(true);
    };

    const confirmAddSize = () => {
        if (newSizeName && !sizes.includes(newSizeName)) {
            setSizes(prev => [...prev, newSizeName]);
            setValues(prev => ({
                ...prev,
                [newSizeName]: measurementTypes.reduce((acc, type) => ({ ...acc, [type]: '' }), {}),
            }));
        }
        setShowAddSizeModal(false);
        setNewSizeName('');
    };

    const removeSize = (size: string) => {
        if (sizes.length <= 1) return;
        setSizes(prev => prev.filter(s => s !== size));
        setValues(prev => {
            const newValues = { ...prev };
            delete newValues[size];
            return newValues;
        });
    };

    const getAvailableMeasurementTypes = () => {
        return MEASUREMENT_TYPES.filter(t => !measurementTypes.includes(t.value));
    };

    const addMeasurementType = () => {
        const availableTypes = getAvailableMeasurementTypes();
        if (availableTypes.length === 0) {
            toast.error('All measurement types have been added');
            return;
        }
        setSelectedMeasurementIndex(null);
        setShowAddMeasurementModal(true);
    };

    const confirmAddMeasurement = () => {
        const availableTypes = getAvailableMeasurementTypes();
        if (selectedMeasurementIndex !== null && selectedMeasurementIndex >= 0 && selectedMeasurementIndex < availableTypes.length) {
            const newType = availableTypes[selectedMeasurementIndex].value;
            setMeasurementTypes(prev => [...prev, newType]);
            setValues(prev => {
                const newValues = { ...prev };
                for (const size of sizes) {
                    newValues[size] = { ...newValues[size], [newType]: '' };
                }
                return newValues;
            });
        }
        setShowAddMeasurementModal(false);
        setSelectedMeasurementIndex(null);
    };

    const removeMeasurementType = (type: string) => {
        if (measurementTypes.length <= 1) return;
        setMeasurementTypes(prev => prev.filter(t => t !== type));
        setValues(prev => {
            const newValues = { ...prev };
            for (const size of sizes) {
                if (newValues[size]) {
                    delete newValues[size][type];
                }
            }
            return newValues;
        });
    };

    const getMeasurementLabel = (type: string) => {
        const found = MEASUREMENT_TYPES.find(t => t.value === type);
        return found ? found.label : type;
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            toast.error('Please enter a name for the size chart');
            return;
        }

        // Convert values to numbers
        const measurements: Record<string, Record<string, number>> = {};
        for (const size of sizes) {
            measurements[size] = {};
            for (const type of measurementTypes) {
                const val = parseFloat(values[size]?.[type] || '0');
                if (!isNaN(val) && val > 0) {
                    measurements[size][type] = val;
                }
            }
        }

        onSave({
            name: name.trim(),
            gender,
            measurements,
            notes: notes.trim() || null,
            is_active: isActive,
        });
    };

    return (
        <div className="space-y-6">
            {/* Basic Info */}
            <PolarisCard title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PolarisTextField
                        label="Chart Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Baju Kurung Moden"
                        required
                    />
                    <PolarisSelect
                        label="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        options={[
                            { value: 'women', label: 'Wanita' },
                            { value: 'men', label: 'Lelaki' },
                            { value: 'unisex', label: 'Unisex' },
                            { value: 'kids', label: 'Kanak-kanak' },
                        ]}
                    />
                </div>
                <div className="mt-4">
                    <PolarisTextField
                        label="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional notes about this size chart (optional)"
                        multiline
                    />
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                </div>
            </PolarisCard>

            {/* Measurements Table */}
            <PolarisCard>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold">Size Measurements (cm)</h3>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={addSize}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                            <Plus className="w-4 h-4" /> Add Size
                        </button>
                        <button
                            type="button"
                            onClick={addMeasurementType}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                            <Plus className="w-4 h-4" /> Add Measurement
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium text-gray-600">Measurement</th>
                                {sizes.map(size => (
                                    <th key={size} className="px-3 py-2 text-center font-medium text-gray-600">
                                        <div className="flex items-center justify-center gap-1">
                                            <span>{size}</span>
                                            {sizes.length > 1 && (
                                                <button
                                                    onClick={() => removeSize(size)}
                                                    className="text-gray-400 hover:text-red-500"
                                                    title="Remove size"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {measurementTypes.map(type => (
                                <tr key={type}>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-700">{getMeasurementLabel(type)}</span>
                                            {measurementTypes.length > 1 && (
                                                <button
                                                    onClick={() => removeMeasurementType(type)}
                                                    className="text-gray-400 hover:text-red-500"
                                                    title="Remove measurement"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    {sizes.map(size => (
                                        <td key={`${size}-${type}`} className="px-2 py-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={values[size]?.[type] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                                        handleValueChange(size, type, val);
                                                    }
                                                }}
                                                placeholder="0"
                                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </PolarisCard>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {saving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Size Chart
                        </>
                    )}
                </button>
            </div>

            {/* Add Size Modal */}
            {showAddSizeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddSizeModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Size</h3>
                        <input
                            type="text"
                            value={newSizeName}
                            onChange={(e) => setNewSizeName(e.target.value.toUpperCase())}
                            placeholder="e.g., 3XL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && confirmAddSize()}
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddSizeModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAddSize}
                                disabled={!newSizeName.trim()}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Add Size
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Measurement Modal */}
            {showAddMeasurementModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddMeasurementModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Measurement Type</h3>
                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                            {getAvailableMeasurementTypes().map((type, index) => (
                                <button
                                    key={type.value}
                                    onClick={() => setSelectedMeasurementIndex(index)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                                        selectedMeasurementIndex === index
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddMeasurementModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAddMeasurement}
                                disabled={selectedMeasurementIndex === null}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Add Measurement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { PaymentMethod } from './PaymentMethodForm';
import PaymentMethodForm from './PaymentMethodForm';
import { Badge } from '@niaga/lib-ui/primitives/badge';
import { Button } from '@niaga/lib-ui/primitives/button';
import { Switch } from '@niaga/lib-ui/primitives/switch';
import { Pencil, GripVertical, CreditCard, Banknote, Building2 } from 'lucide-react';

interface PaymentMethodsTableProps {
    methods: PaymentMethod[];
    onUpdate: (id: string, updates: Partial<PaymentMethod>) => Promise<void>;
    onSave: (id: string, data: Omit<PaymentMethod, 'id'>) => Promise<void>;
    onReorder: (methods: PaymentMethod[]) => Promise<void>;
}

export default function PaymentMethodsTable({ methods, onUpdate, onSave, onReorder }: PaymentMethodsTableProps) {
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const sortedMethods = [...methods].sort((a, b) => a.sortOrder - b.sortOrder);

    const getMethodIcon = (code: string) => {
        switch (code) {
            case 'fpx':
            case 'card':
                return <CreditCard className="w-5 h-5" />;
            case 'cash_deposit':
                return <Banknote className="w-5 h-5" />;
            case 'bank_transfer':
                return <Building2 className="w-5 h-5" />;
            default:
                return <CreditCard className="w-5 h-5" />;
        }
    };

    const handleToggleActive = async (method: PaymentMethod) => {
        await onUpdate(method.id, { isActive: !method.isActive });
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newMethods = [...sortedMethods];
        const draggedMethod = newMethods[draggedIndex];

        newMethods.splice(draggedIndex, 1);
        newMethods.splice(index, 0, draggedMethod);

        // Update sort orders
        const reorderedMethods = newMethods.map((method, idx) => ({
            ...method,
            sortOrder: idx,
        }));

        setDraggedIndex(index);
        onReorder(reorderedMethods);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const formatMYR = (amount?: number) => {
        if (!amount) return '-';
        return `RM ${amount.toFixed(2)}`;
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-2 py-3 text-left w-10"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Payment Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Bank Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Settings
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Limits
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedMethods.map((method, index) => (
                                <tr
                                    key={method.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`hover:bg-gray-50 transition cursor-move ${draggedIndex === index ? 'opacity-50' : ''
                                        }`}
                                >
                                    {/* Drag Handle */}
                                    <td className="px-2 py-4">
                                        <GripVertical className="w-5 h-5 text-gray-400" />
                                    </td>

                                    {/* Payment Method Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                {getMethodIcon(method.code)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{method.name}</p>
                                                <p className="text-sm text-gray-500">{method.nameMalay}</p>
                                                <p className="text-xs text-gray-400 font-mono">{method.code}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Bank Details */}
                                    <td className="px-6 py-4">
                                        {method.bankName ? (
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">{method.bankName}</p>
                                                <p className="text-gray-600">{method.accountName}</p>
                                                <p className="text-gray-500 font-mono text-xs">{method.accountNumber}</p>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">No bank details</span>
                                        )}
                                    </td>

                                    {/* Settings */}
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {method.requiresReceipt && (
                                                <Badge variant="outline" className="text-xs">
                                                    Receipt Required
                                                </Badge>
                                            )}
                                            {method.requiresVerification && (
                                                <Badge variant="outline" className="text-xs">
                                                    Verification Required
                                                </Badge>
                                            )}
                                            {!method.requiresReceipt && !method.requiresVerification && (
                                                <span className="text-xs text-gray-400">Instant</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Limits */}
                                    <td className="px-6 py-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">
                                                Min: {formatMYR(method.minAmount)}
                                            </p>
                                            <p className="text-gray-600">
                                                Max: {method.maxAmount ? formatMYR(method.maxAmount) : 'Unlimited'}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Switch
                                                checked={method.isActive}
                                                onCheckedChange={() => handleToggleActive(method)}
                                            />
                                            <span className={`text-sm font-medium ${method.isActive ? 'text-green-600' : 'text-gray-400'
                                                }`}>
                                                {method.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingMethod(method)}
                                        >
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {methods.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <p className="text-lg font-semibold">No payment methods configured</p>
                                        <p className="text-sm">Add your first payment method to get started</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingMethod && (
                <PaymentMethodForm
                    method={editingMethod}
                    onClose={() => setEditingMethod(null)}
                    onSave={(data) => onSave(editingMethod.id, data)}
                />
            )}
        </>
    );
}

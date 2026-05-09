'use client';

import { useState } from 'react';
import { Button } from '@niaga/lib-ui/primitives/button';
import { Input } from '@niaga/lib-ui/primitives/input';
import { Label } from '@niaga/lib-ui/primitives/label';
import { Textarea } from '@niaga/lib-ui/primitives/textarea';
import { Switch } from '@niaga/lib-ui/primitives/switch';
import { X, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface PaymentMethod {
    id: string;
    code: string;
    name: string;
    nameMalay: string;
    description: string;
    instructions: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    requiresReceipt: boolean;
    requiresVerification: boolean;
    minAmount?: number;
    maxAmount?: number;
    isActive: boolean;
    sortOrder: number;
}

interface PaymentMethodFormProps {
    method?: PaymentMethod;
    onClose: () => void;
    onSave: (data: Omit<PaymentMethod, 'id'>) => Promise<void>;
}

export default function PaymentMethodForm({ method, onClose, onSave }: PaymentMethodFormProps) {
    const [formData, setFormData] = useState<Omit<PaymentMethod, 'id'>>({
        code: method?.code || '',
        name: method?.name || '',
        nameMalay: method?.nameMalay || '',
        description: method?.description || '',
        instructions: method?.instructions || '',
        bankName: method?.bankName || '',
        accountName: method?.accountName || '',
        accountNumber: method?.accountNumber || '',
        requiresReceipt: method?.requiresReceipt ?? false,
        requiresVerification: method?.requiresVerification ?? false,
        minAmount: method?.minAmount,
        maxAmount: method?.maxAmount,
        isActive: method?.isActive ?? true,
        sortOrder: method?.sortOrder || 0,
    });

    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Please enter payment method name');
            return;
        }

        if (!formData.nameMalay.trim()) {
            toast.error('Please enter Malay name');
            return;
        }

        try {
            setSaving(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            toast.error('Failed to save payment method');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {method ? 'Edit Payment Method' : 'Add Payment Method'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        disabled={saving}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Code */}
                            <div>
                                <Label htmlFor="code">Code *</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="fpx, card, cash_deposit"
                                    required
                                    disabled={!!method}
                                />
                                {method && (
                                    <p className="text-xs text-gray-500 mt-1">Code cannot be changed</p>
                                )}
                            </div>

                            {/* Sort Order */}
                            <div>
                                <Label htmlFor="sortOrder">Sort Order</Label>
                                <Input
                                    id="sortOrder"
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                    min={0}
                                />
                            </div>

                            {/* Name (English) */}
                            <div>
                                <Label htmlFor="name">Name (English) *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Online Banking (FPX)"
                                    required
                                />
                            </div>

                            {/* Name (Malay) */}
                            <div>
                                <Label htmlFor="nameMalay">Name (Malay) *</Label>
                                <Input
                                    id="nameMalay"
                                    value={formData.nameMalay}
                                    onChange={(e) => setFormData({ ...formData, nameMalay: e.target.value })}
                                    placeholder="Perbankan Dalam Talian (FPX)"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Short description of this payment method"
                                rows={2}
                            />
                        </div>

                        {/* Instructions */}
                        <div className="mt-4">
                            <Label htmlFor="instructions">Instructions</Label>
                            <Textarea
                                id="instructions"
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                placeholder="Step-by-step instructions for customers"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            For manual payment methods (CDM, Bank Transfer)
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Bank Name */}
                            <div>
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input
                                    id="bankName"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    placeholder="Maybank"
                                />
                            </div>

                            {/* Account Name */}
                            <div>
                                <Label htmlFor="accountName">Account Name</Label>
                                <Input
                                    id="accountName"
                                    value={formData.accountName}
                                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                    placeholder="NIAGA PLATFORM SDN BHD"
                                />
                            </div>

                            {/* Account Number */}
                            <div>
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input
                                    id="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    placeholder="562123456789"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>

                        <div className="space-y-4">
                            {/* Requires Receipt */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <Label htmlFor="requiresReceipt" className="cursor-pointer">
                                        Requires Receipt Upload
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                        Customer must upload payment receipt
                                    </p>
                                </div>
                                <Switch
                                    id="requiresReceipt"
                                    checked={formData.requiresReceipt}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, requiresReceipt: checked })
                                    }
                                />
                            </div>

                            {/* Requires Verification */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <Label htmlFor="requiresVerification" className="cursor-pointer">
                                        Requires Admin Verification
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                        Payment must be verified by admin before order processing
                                    </p>
                                </div>
                                <Switch
                                    id="requiresVerification"
                                    checked={formData.requiresVerification}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, requiresVerification: checked })
                                    }
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                                <div>
                                    <Label htmlFor="isActive" className="cursor-pointer">
                                        Active
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                        Show this payment method to customers
                                    </p>
                                </div>
                                <Switch
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isActive: checked })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount Limits */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Amount Limits</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Min Amount */}
                            <div>
                                <Label htmlFor="minAmount">Minimum Amount (RM)</Label>
                                <Input
                                    id="minAmount"
                                    type="number"
                                    value={formData.minAmount || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        minAmount: e.target.value ? parseFloat(e.target.value) : undefined
                                    })}
                                    placeholder="0.00"
                                    step="0.01"
                                    min={0}
                                />
                            </div>

                            {/* Max Amount */}
                            <div>
                                <Label htmlFor="maxAmount">Maximum Amount (RM)</Label>
                                <Input
                                    id="maxAmount"
                                    type="number"
                                    value={formData.maxAmount || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        maxAmount: e.target.value ? parseFloat(e.target.value) : undefined
                                    })}
                                    placeholder="Unlimited"
                                    step="0.01"
                                    min={0}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                        >
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            <Save className="w-4 h-4 mr-2" />
                            {method ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

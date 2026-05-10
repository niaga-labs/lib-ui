'use client';

import { useState } from 'react';
import { Button } from '../../primitives/button';
import { Input } from '../../primitives/input';
import { Label } from '../../primitives/label';
import { Switch } from '../../primitives/switch';
import { Badge } from '../../primitives/badge';
import { Loader2, Shield, Check } from 'lucide-react';
import type { UserFormData, RoleOption } from './users';

interface UserFormProps {
    roles: RoleOption[];
    initialData?: UserFormData & { id?: string };
    onSubmit: (data: UserFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function UserForm({ roles, initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        email: initialData?.email || '',
        password: '',
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        status: initialData?.status || 'active',
        roleIds: initialData?.roleIds || [],
    });

    const [passwordError, setPasswordError] = useState<string>('');

    const isNewUser = !initialData?.id;
    const MIN_PASSWORD_LENGTH = 8;

    const validatePassword = (password: string): string => {
        if (isNewUser && !password) {
            return 'Password is required for new users';
        }
        if (password && password.length < MIN_PASSWORD_LENGTH) {
            return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordValidationError = validatePassword(formData.password || '');
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        await onSubmit(formData);
    };

    const handleRoleToggle = (roleValue: string) => {
        setFormData(prev => ({
            ...prev,
            roleIds: prev.roleIds.includes(roleValue)
                ? prev.roleIds.filter(r => r !== roleValue)
                : [...prev.roleIds, roleValue],
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        required
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                />
            </div>

            {/* Password */}
            <div>
                <Label htmlFor="password">
                    Password {!initialData?.id && '*'}
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                        const newPassword = e.target.value;
                        setFormData({ ...formData, password: newPassword });
                        setPasswordError(validatePassword(newPassword));
                    }}
                    placeholder={initialData?.id ? 'Leave blank to keep current' : 'Enter password (min 8 characters)'}
                    required={!initialData?.id}
                    minLength={MIN_PASSWORD_LENGTH}
                />
                {passwordError && (
                    <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                )}
                {initialData?.id && !passwordError && (
                    <p className="text-sm text-gray-500 mt-1">
                        Leave blank to keep the current password
                    </p>
                )}
            </div>

            {/* Roles */}
            <div>
                <Label className="mb-2 block">Assign Role *</Label>
                <p className="text-sm text-gray-500 mb-3">
                    Select a role for this user. Each role has predefined permissions.
                </p>
                <div className="space-y-2">
                    {roles.map((role) => {
                        const isSelected = formData.roleIds.includes(role.value);

                        return (
                            <div
                                key={role.value}
                                onClick={() => handleRoleToggle(role.value)}
                                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                        <Shield className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900">{role.displayName}</p>
                                            <Badge variant="outline" className={role.color}>
                                                {role.permissionCount} permissions
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">{role.description}</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-300'
                                }`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                        );
                    })}
                    {formData.roleIds.length === 0 && (
                        <p className="text-sm text-red-600 mt-2">At least one role must be selected</p>
                    )}
                </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <Label htmlFor="status" className="cursor-pointer">Active Status</Label>
                    <p className="text-sm text-gray-500">
                        Inactive users cannot log in to the system
                    </p>
                </div>
                <Switch
                    id="status"
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || formData.roleIds.length === 0 || !!passwordError || (isNewUser && !formData.password)}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {initialData?.id ? 'Update User' : 'Create User'}
                </Button>
            </div>
        </form>
    );
}

import { useState } from 'react';
import { Input } from '../../primitives/input';
import { Label } from '../../primitives/label';
import { Button } from '../../primitives/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../primitives/select';
import type { Customer } from './CustomerSearch';

interface CustomerFormProps {
    onSubmit: (customer: Customer) => void;
    onCancel?: () => void;
}

export function CustomerForm({ onSubmit, onCancel }: CustomerFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postcode: '',
        state: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const malaysianStates = [
        'Johor',
        'Kedah',
        'Kelantan',
        'Melaka',
        'Negeri Sembilan',
        'Pahang',
        'Penang',
        'Perak',
        'Perlis',
        'Sabah',
        'Sarawak',
        'Selangor',
        'Terengganu',
        'Wilayah Persekutuan',
    ];

    const validatePhone = (phone: string): boolean => {
        // Malaysian phone format: starts with 01, 10-11 digits
        const phoneRegex = /^01[0-9]{8,9}$/;
        return phoneRegex.test(phone.replace(/[-\s]/g, ''));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama diperlukan';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'No. telefon diperlukan';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Format no. telefon tidak sah (cth: 0123456789)';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const customer: Customer = {
            id: `new-${Date.now()}`,
            ...formData,
        };

        onSubmit(customer);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <Label htmlFor="name">Nama <span className="text-destructive">*</span></Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Nama penuh"
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                </div>

                <div className="col-span-2">
                    <Label htmlFor="phone">No. Telefon <span className="text-destructive">*</span></Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="0123456789"
                    />
                    {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                    )}
                </div>

                <div className="col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="email@example.com"
                    />
                </div>

                <div className="col-span-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="No. dan nama jalan"
                    />
                </div>

                <div>
                    <Label htmlFor="city">Bandar</Label>
                    <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Kuala Lumpur"
                    />
                </div>

                <div>
                    <Label htmlFor="postcode">Poskod</Label>
                    <Input
                        id="postcode"
                        value={formData.postcode}
                        onChange={(e) => handleChange('postcode', e.target.value)}
                        placeholder="50000"
                        maxLength={5}
                    />
                </div>

                <div className="col-span-2">
                    <Label htmlFor="state">Negeri</Label>
                    <Select value={formData.state} onValueChange={(value) => handleChange('state', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih negeri" />
                        </SelectTrigger>
                        <SelectContent>
                            {malaysianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                    {state}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                    Tambah Pelanggan
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Batal
                    </Button>
                )}
            </div>
        </form>
    );
}

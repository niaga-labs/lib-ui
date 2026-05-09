import { Label } from '../../primitives/label';
import { RadioGroup, RadioGroupItem } from '../../primitives/radio-group';

interface PaymentMethodSelectProps {
    value: string;
    onChange: (value: string) => void;
}

export function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
    const paymentMethods = [
        {
            id: 'online',
            label: 'Bayaran Online',
            description: 'Customer akan terima link pembayaran',
        },
        {
            id: 'cdm',
            label: 'Cash Deposit (CDM)',
            description: 'Deposit tunai di mesin CDM bank',
        },
        {
            id: 'transfer',
            label: 'Bank Transfer',
            description: 'Pindahan bank terus',
        },
        {
            id: 'cod',
            label: 'Cash on Delivery',
            description: 'Bayar semasa terima barang',
        },
    ];

    return (
        <div className="space-y-3">
            <Label>Kaedah Pembayaran</Label>
            <RadioGroup value={value} onValueChange={onChange}>
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => onChange(method.id)}
                    >
                        <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                        <div className="flex-1">
                            <Label
                                htmlFor={method.id}
                                className="font-medium cursor-pointer"
                            >
                                {method.label}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {method.description}
                            </p>
                        </div>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
}

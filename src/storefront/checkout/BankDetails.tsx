'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@niaga/lib-ui/primitives/card';
import { Button } from '@niaga/lib-ui/primitives/button';
import { Building2, Copy, Check, CreditCard } from 'lucide-react';

interface BankDetailsProps {
    bankName: string;
    accountName: string;
    accountNumber: string;
    amount?: number;
    className?: string;
}

export function BankDetails({
    bankName,
    accountName,
    accountNumber,
    amount,
    className,
}: BankDetailsProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const CopyButton = ({ text, field }: { text: string; field: string }) => (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => copyToClipboard(text, field)}
        >
            {copiedField === field ? (
                <Check className="h-4 w-4 text-green-600" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    );

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5" />
                    Bank Account Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Bank Name</p>
                            <p className="font-semibold">{bankName}</p>
                        </div>
                        <CopyButton text={bankName} field="bank" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Account Name</p>
                            <p className="font-semibold">{accountName}</p>
                        </div>
                        <CopyButton text={accountName} field="name" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Account Number</p>
                            <p className="font-mono font-bold text-lg tracking-wider">
                                {accountNumber}
                            </p>
                        </div>
                        <CopyButton text={accountNumber} field="account" />
                    </div>

                    {amount !== undefined && (
                        <div className="flex items-center justify-between border-t pt-3 mt-3">
                            <div>
                                <p className="text-xs text-muted-foreground">Payment Amount</p>
                                <p className="font-mono font-bold text-xl text-primary">
                                    RM {amount.toFixed(2)}
                                </p>
                            </div>
                            <CopyButton text={amount.toFixed(2)} field="amount" />
                        </div>
                    )}
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                    <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-medium">Important:</p>
                        <ul className="mt-1 space-y-1 text-xs">
                            <li>Make sure you transfer to the correct account</li>
                            <li>Keep payment receipt for uploading</li>
                            <li>Payment will be verified within 24 working hours</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

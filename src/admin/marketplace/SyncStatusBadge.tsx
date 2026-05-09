'use client';

import { Badge } from '@niaga/lib-ui/primitives/badge';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

type SyncStatus = 'pending' | 'syncing' | 'synced' | 'error';

interface SyncStatusBadgeProps {
    status: SyncStatus | string;
    showIcon?: boolean;
}

export function SyncStatusBadge({ status, showIcon = true }: SyncStatusBadgeProps) {
    const getStatusConfig = (s: string) => {
        switch (s.toLowerCase()) {
            case 'synced':
                return {
                    type: 'info' as const,
                    className: 'bg-green-500 hover:bg-green-600',
                    icon: CheckCircle,
                    label: 'Synced',
                };
            case 'syncing':
            case 'processing':
                return {
                    variant: 'secondary' as const,
                    className: 'bg-blue-500 hover:bg-blue-600 text-white',
                    icon: Loader2,
                    label: 'Syncing',
                    animate: true,
                };
            case 'pending':
                return {
                    variant: 'secondary' as const,
                    className: 'bg-yellow-500 hover:bg-yellow-600 text-black',
                    icon: Clock,
                    label: 'Pending',
                };
            case 'error':
            case 'failed':
                return {
                    type: 'danger' as const,
                    className: '',
                    icon: AlertCircle,
                    label: 'Error',
                };
            default:
                return {
                    variant: 'secondary' as const,
                    className: '',
                    icon: Clock,
                    label: status,
                };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={config.className}>
            {showIcon && (
                <Icon className={`h-3 w-3 mr-1 ${config.animate ? 'animate-spin' : ''}`} />
            )}
            {config.label}
        </Badge>
    );
}

interface ConnectionStatusProps {
    isActive: boolean;
    tokenExpiresAt: string;
}

export function ConnectionStatus({ isActive, tokenExpiresAt }: ConnectionStatusProps) {
    const isExpired = new Date(tokenExpiresAt) < new Date();
    const isExpiring = new Date(tokenExpiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (!isActive) {
        return <Badge variant="secondary">Disconnected</Badge>;
    }

    if (isExpired) {
        return <Badge variant="destructive">Token Expired</Badge>;
    }

    if (isExpiring) {
        return <Badge className="bg-yellow-500 text-black">Token Expiring</Badge>;
    }

    return <Badge className="bg-green-500">Connected</Badge>;
}

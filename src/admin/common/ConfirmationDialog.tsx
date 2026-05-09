'use client';

import * as React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { PolarisModal } from '@niaga/lib-ui/admin/polaris';
import { AlertTriangle, Trash2, AlertCircle, HelpCircle } from 'lucide-react';

// Types
export type ConfirmationType = 'danger' | 'warning' | 'info';

export interface ConfirmationOptions {
    title: string;
    message: string | React.ReactNode;
    type?: ConfirmationType;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}

interface ConfirmationContextType {
    confirm: (options: ConfirmationOptions) => Promise<boolean>;
    isOpen: boolean;
}

// Context
const ConfirmationContext = createContext<ConfirmationContextType | null>(null);

// Provider Component
export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmationOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);
    const [loading, setLoading] = useState(false);

    const confirm = useCallback((opts: ConfirmationOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(opts);
            setResolvePromise(() => resolve);
            setIsOpen(true);
        });
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setLoading(false);
        if (resolvePromise) {
            resolvePromise(false);
        }
        options?.onCancel?.();
        // Reset after animation
        setTimeout(() => {
            setOptions(null);
            setResolvePromise(null);
        }, 200);
    }, [resolvePromise, options]);

    const handleConfirm = useCallback(async () => {
        setLoading(true);
        try {
            await options?.onConfirm?.();
            if (resolvePromise) {
                resolvePromise(true);
            }
            setIsOpen(false);
        } catch (error) {
            console.error('Confirmation action failed:', error);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setOptions(null);
                setResolvePromise(null);
            }, 200);
        }
    }, [options, resolvePromise]);

    const typeConfig = {
        danger: {
            icon: Trash2,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
        },
        info: {
            icon: HelpCircle,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
    };

    const config = options?.type ? typeConfig[options.type] : typeConfig.info;
    const Icon = config.icon;

    return (
        <ConfirmationContext.Provider value={{ confirm, isOpen }}>
            {children}
            <PolarisModal
                open={isOpen}
                onClose={handleClose}
                title={options?.title || 'Confirm Action'}
                size="small"
                primaryAction={{
                    content: options?.confirmLabel || 'Confirm',
                    onAction: handleConfirm,
                    loading,
                    destructive: options?.type === 'danger',
                }}
                secondaryAction={{
                    content: options?.cancelLabel || 'Cancel',
                    onAction: handleClose,
                }}
            >
                <div className="flex gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
                    </div>
                    <div className="flex-1 pt-1">
                        {typeof options?.message === 'string' ? (
                            <p className="text-sm text-[hsl(var(--p-text-subdued))]">{options.message}</p>
                        ) : (
                            options?.message
                        )}
                    </div>
                </div>
            </PolarisModal>
        </ConfirmationContext.Provider>
    );
}

// Hook
export function useConfirmation() {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirmation must be used within a ConfirmationProvider');
    }
    return context;
}

// Standalone Component (for single-use without provider)
interface ConfirmationDialogProps extends ConfirmationOptions {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loading?: boolean;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    title,
    message,
    type = 'info',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmationDialogProps) {
    const typeConfig = {
        danger: {
            icon: Trash2,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
        },
        info: {
            icon: HelpCircle,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    const handleClose = () => {
        onOpenChange(false);
        onCancel?.();
    };

    const handleConfirm = async () => {
        await onConfirm?.();
        onOpenChange(false);
    };

    return (
        <PolarisModal
            open={open}
            onClose={handleClose}
            title={title}
            size="small"
            primaryAction={{
                content: confirmLabel,
                onAction: handleConfirm,
                loading,
                destructive: type === 'danger',
            }}
            secondaryAction={{
                content: cancelLabel,
                onAction: handleClose,
            }}
        >
            <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
                </div>
                <div className="flex-1 pt-1">
                    {typeof message === 'string' ? (
                        <p className="text-sm text-[hsl(var(--p-text-subdued))]">{message}</p>
                    ) : (
                        message
                    )}
                </div>
            </div>
        </PolarisModal>
    );
}

// Helper functions for common confirmations
export const confirmDelete = (itemName: string) => ({
    title: 'Delete Item',
    message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    type: 'danger' as const,
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
});

export const confirmBulkDelete = (count: number) => ({
    title: 'Delete Items',
    message: `Are you sure you want to delete ${count} item${count !== 1 ? 's' : ''}? This action cannot be undone.`,
    type: 'danger' as const,
    confirmLabel: `Delete ${count} item${count !== 1 ? 's' : ''}`,
    cancelLabel: 'Cancel',
});

export const confirmStatusChange = (status: string) => ({
    title: 'Change Status',
    message: `Are you sure you want to change the status to "${status}"?`,
    type: 'warning' as const,
    confirmLabel: 'Change Status',
    cancelLabel: 'Cancel',
});

export const confirmAction = (action: string, details?: string) => ({
    title: `Confirm ${action}`,
    message: details || `Are you sure you want to ${action.toLowerCase()}?`,
    type: 'info' as const,
    confirmLabel: action,
    cancelLabel: 'Cancel',
});

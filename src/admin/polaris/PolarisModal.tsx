'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    primaryAction?: {
        content: string;
        onAction: () => void | Promise<void>;
        loading?: boolean;
        disabled?: boolean;
        destructive?: boolean;
    };
    secondaryAction?: {
        content: string;
        onAction: () => void;
        disabled?: boolean;
    };
    size?: 'small' | 'medium' | 'large';
}

export function PolarisModal({
    open,
    onClose,
    title,
    children,
    primaryAction,
    secondaryAction,
    size = 'medium',
}: ModalProps) {
    const sizeClasses = {
        small: 'max-w-sm',
        medium: 'max-w-md',
        large: 'max-w-2xl',
    };

    // Close on Escape
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    // Prevent scroll when open
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 p-animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <div
                        className={cn(
                            "relative w-full bg-[hsl(var(--p-surface))] rounded-xl shadow-[var(--p-shadow-600)]",
                            "p-animate-scale-in",
                            sizeClasses[size]
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--p-border))]">
                            <h2 className="text-lg font-semibold text-[hsl(var(--p-text))]">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-lg hover:bg-[hsl(var(--p-surface-hovered))] transition-colors"
                            >
                                <X className="w-5 h-5 text-[hsl(var(--p-icon-subdued))]" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-4">
                            {children}
                        </div>

                        {/* Footer */}
                        {(primaryAction || secondaryAction) && (
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[hsl(var(--p-border))] bg-[hsl(var(--p-surface-subdued))] rounded-b-xl">
                                {secondaryAction && (
                                    <button
                                        onClick={secondaryAction.onAction}
                                        disabled={secondaryAction.disabled}
                                        className="px-4 py-2 text-sm font-medium rounded-lg border border-[hsl(var(--p-border))] text-[hsl(var(--p-text))] hover:bg-[hsl(var(--p-surface-hovered))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {secondaryAction.content}
                                    </button>
                                )}
                                {primaryAction && (
                                    <button
                                        onClick={primaryAction.onAction}
                                        disabled={primaryAction.disabled || primaryAction.loading}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2",
                                            primaryAction.destructive
                                                ? "bg-[hsl(var(--p-critical))] hover:bg-[hsl(0_74%_36%)]"
                                                : "bg-[hsl(var(--p-action-primary))] hover:bg-[hsl(var(--p-action-primary-hovered))]"
                                        )}
                                    >
                                        {primaryAction.loading && (
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        )}
                                        {primaryAction.content}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline Progress Bar
interface ProgressBarProps {
    value: number;
    max?: number;
    color?: 'success' | 'warning' | 'critical' | 'info';
    showLabel?: boolean;
}

export function PolarisProgressBar({ value, max = 100, color = 'info', showLabel = false }: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const colorClasses = {
        success: 'bg-[hsl(var(--p-success))]',
        warning: 'bg-[hsl(var(--p-warning))]',
        critical: 'bg-[hsl(var(--p-critical))]',
        info: 'bg-[hsl(var(--p-interactive))]',
    };

    return (
        <div className="space-y-1">
            {showLabel && (
                <div className="flex items-center justify-between text-xs text-[hsl(var(--p-text-subdued))]">
                    <span>{value}</span>
                    <span>{percentage.toFixed(0)}%</span>
                </div>
            )}
            <div className="w-full h-2 bg-[hsl(var(--p-surface-subdued))] rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-300", colorClasses[color])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

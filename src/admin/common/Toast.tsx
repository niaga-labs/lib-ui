'use client';

import { Toaster, toast as sonnerToast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

// Toast type
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Standalone toast function - can be called anywhere
export function toast(message: string, type: ToastType = 'info', options?: { duration?: number; description?: string }) {
    const iconClasses = 'w-5 h-5';

    switch (type) {
        case 'success':
            sonnerToast.success(message, {
                description: options?.description,
                duration: options?.duration ?? 4000,
                icon: <CheckCircle className={`${iconClasses} text-green-500`} />,
            });
            break;
        case 'error':
            sonnerToast.error(message, {
                description: options?.description,
                duration: options?.duration ?? 5000,
                icon: <XCircle className={`${iconClasses} text-red-500`} />,
            });
            break;
        case 'warning':
            sonnerToast.warning(message, {
                description: options?.description,
                duration: options?.duration ?? 4000,
                icon: <AlertCircle className={`${iconClasses} text-yellow-500`} />,
            });
            break;
        case 'info':
        default:
            sonnerToast.info(message, {
                description: options?.description,
                duration: options?.duration ?? 4000,
                icon: <Info className={`${iconClasses} text-blue-500`} />,
            });
            break;
    }
}

// Promise toast for async operations
export function toastPromise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
) {
    return sonnerToast.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
    });
}

// Dismiss all toasts
export function dismissAllToasts() {
    sonnerToast.dismiss();
}

// ToastProvider component - add to root layout
export function ToastProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                expand={false}
                richColors
                closeButton
                toastOptions={{
                    className: 'text-sm',
                    duration: 4000,
                }}
            />
        </>
    );
}

// Legacy hook for backward compatibility
export function useToast() {
    const showToast = (message: string, type: ToastType = 'info') => {
        toast(message, type);
    };

    // Empty container - Sonner uses Toaster at root level
    const ToastContainer = () => null;

    return { showToast, ToastContainer };
}

// Legacy Toast component export for backward compatibility
interface LegacyToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

export function Toast({ message, type }: LegacyToastProps) {
    // This is now handled by Sonner, but keep for any direct usage
    toast(message, type);
    return null;
}

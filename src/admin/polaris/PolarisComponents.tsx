'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

// ============ POLARIS CARD ============
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'tight' | 'base' | 'loose';
    title?: string;
    subtitle?: string;
    action?: {
        content: string;
        onAction: () => void;
    };
}

export function PolarisCard({
    className,
    padding = 'base',
    title,
    subtitle,
    action,
    children,
    ...props
}: CardProps) {
    const paddingStyles = {
        none: '',
        tight: 'p-3',
        base: 'p-4',
        loose: 'p-6',
    };

    return (
        <div
            className={cn(
                "bg-[hsl(var(--p-surface))] rounded-lg border border-[hsl(var(--p-border))] shadow-[var(--p-shadow-300)]",
                paddingStyles[padding],
                className
            )}
            {...props}
        >
            {(title || action) && (
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        {title && <h3 className="text-base font-semibold text-[hsl(var(--p-text))]">{title}</h3>}
                        {subtitle && <p className="text-sm text-[hsl(var(--p-text-subdued))] mt-0.5">{subtitle}</p>}
                    </div>
                    {action && (
                        <button
                            onClick={action.onAction}
                            className="text-sm text-[hsl(var(--p-text-interactive))] hover:underline"
                        >
                            {action.content}
                        </button>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export function PolarisCardHeader({ title, subtitle, actions, className, ...props }: CardHeaderProps) {
    return (
        <div className={cn("flex items-start justify-between gap-4 mb-4", className)} {...props}>
            <div>
                <h3 className="text-base font-semibold text-[hsl(var(--p-text))]">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-[hsl(var(--p-text-subdued))] mt-0.5">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}

export function PolarisCardSection({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("py-4 border-t border-[hsl(var(--p-border-subdued))] first:border-t-0 first:pt-0", className)}
            {...props}
        >
            {children}
        </div>
    );
}

// ============ POLARIS BADGE ============
type BadgeStatus = 'success' | 'warning' | 'critical' | 'info' | 'attention' | 'new';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status?: BadgeStatus;
    progress?: 'incomplete' | 'partiallyComplete' | 'complete';
}

export function PolarisBadge({
    status = 'info',
    children,
    className,
    ...props
}: BadgeProps) {
    const statusStyles = {
        success: 'bg-[hsl(var(--p-success-subdued))] text-[hsl(var(--p-text-success))]',
        warning: 'bg-[hsl(var(--p-warning-subdued))] text-[hsl(var(--p-text-warning))]',
        critical: 'bg-[hsl(var(--p-critical-subdued))] text-[hsl(var(--p-text-critical))]',
        info: 'bg-[hsl(var(--p-info-subdued))] text-[hsl(var(--p-text-interactive))]',
        attention: 'bg-yellow-100 text-yellow-800',
        new: 'bg-gradient-to-r from-[hsl(var(--p-interactive))] to-[hsl(213_94%_50%)] text-white',
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                statusStyles[status],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

// ============ POLARIS BUTTON ============
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'plain';
type ButtonSize = 'slim' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export function PolarisButton({
    variant = 'secondary',
    size = 'medium',
    loading = false,
    icon,
    fullWidth = false,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const variantStyles = {
        primary: 'bg-[hsl(var(--p-action-primary))] text-white hover:bg-[hsl(var(--p-action-primary-hovered))] active:bg-[hsl(var(--p-action-primary-pressed))] shadow-[var(--p-shadow-100)]',
        secondary: 'bg-[hsl(var(--p-surface))] text-[hsl(var(--p-text))] border border-[hsl(var(--p-border))] hover:bg-[hsl(var(--p-surface-hovered))] hover:border-[hsl(var(--p-border-hovered))]',
        tertiary: 'bg-transparent text-[hsl(var(--p-text-interactive))] hover:bg-[hsl(var(--p-surface-hovered))]',
        destructive: 'bg-[hsl(var(--p-critical))] text-white hover:bg-[hsl(0_74%_36%)]',
        plain: 'bg-transparent text-[hsl(var(--p-text-interactive))] hover:underline p-0',
    };

    const sizeStyles = {
        slim: 'px-2 py-1 text-xs',
        medium: 'px-3 py-2 text-sm',
        large: 'px-4 py-2.5 text-sm',
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--p-interactive))] focus-visible:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                variantStyles[variant],
                variant !== 'plain' && sizeStyles[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {icon && !loading && icon}
            {children}
        </button>
    );
}

// ============ POLARIS TEXT FIELD ============
interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    label?: string;
    helpText?: string;
    error?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    multiline?: boolean;
}

export function PolarisTextField({
    label,
    helpText,
    error,
    prefix,
    suffix,
    className,
    id,
    ...props
}: TextFieldProps) {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-[hsl(var(--p-text))]"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {prefix && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--p-text-subdued))]">
                        {prefix}
                    </div>
                )}
                <input
                    id={inputId}
                    className={cn(
                        "w-full px-3 py-2 text-sm bg-[hsl(var(--p-surface))] rounded-lg",
                        "border transition-colors duration-150",
                        "placeholder:text-[hsl(var(--p-text-disabled))]",
                        "focus:outline-none focus:ring-1",
                        error
                            ? "border-[hsl(var(--p-border-critical))] focus:border-[hsl(var(--p-border-critical))] focus:ring-[hsl(var(--p-critical))]"
                            : "border-[hsl(var(--p-border))] hover:border-[hsl(var(--p-border-hovered))] focus:border-[hsl(var(--p-border-focused))] focus:ring-[hsl(var(--p-interactive))]",
                        prefix && "pl-10",
                        suffix && "pr-10",
                        className
                    )}
                    {...props}
                />
                {suffix && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--p-text-subdued))]">
                        {suffix}
                    </div>
                )}
            </div>
            {helpText && !error && (
                <p className="text-xs text-[hsl(var(--p-text-subdued))]">{helpText}</p>
            )}
            {error && (
                <p className="text-xs text-[hsl(var(--p-text-critical))]">{error}</p>
            )}
        </div>
    );
}

// ============ POLARIS SELECT ============
interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label?: string;
    options: SelectOption[];
    helpText?: string;
    error?: string;
}

export function PolarisSelect({
    label,
    options,
    helpText,
    error,
    className,
    id,
    ...props
}: SelectProps) {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-[hsl(var(--p-text))]"
                >
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={cn(
                    "w-full px-3 py-2 text-sm bg-[hsl(var(--p-surface))] rounded-lg appearance-none",
                    "border transition-colors duration-150",
                    "focus:outline-none focus:ring-1",
                    "bg-no-repeat bg-[length:16px] bg-[right_12px_center]",
                    error
                        ? "border-[hsl(var(--p-border-critical))] focus:ring-[hsl(var(--p-critical))]"
                        : "border-[hsl(var(--p-border))] hover:border-[hsl(var(--p-border-hovered))] focus:border-[hsl(var(--p-border-focused))] focus:ring-[hsl(var(--p-interactive))]",
                    className
                )}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236D7175' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                }}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))}
            </select>
            {helpText && !error && (
                <p className="text-xs text-[hsl(var(--p-text-subdued))]">{helpText}</p>
            )}
            {error && (
                <p className="text-xs text-[hsl(var(--p-text-critical))]">{error}</p>
            )}
        </div>
    );
}

// ============ POLARIS CHECKBOX ============
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
    helpText?: string;
}

export function PolarisCheckbox({
    label,
    helpText,
    className,
    id,
    ...props
}: CheckboxProps) {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
        <div className="flex items-start gap-3">
            <input
                type="checkbox"
                id={checkboxId}
                className={cn(
                    "mt-1 h-4 w-4 rounded border-[hsl(var(--p-border))]",
                    "text-[hsl(var(--p-interactive))] focus:ring-[hsl(var(--p-interactive))]",
                    className
                )}
                {...props}
            />
            <div>
                <label
                    htmlFor={checkboxId}
                    className="text-sm text-[hsl(var(--p-text))] cursor-pointer"
                >
                    {label}
                </label>
                {helpText && (
                    <p className="text-xs text-[hsl(var(--p-text-subdued))] mt-0.5">{helpText}</p>
                )}
            </div>
        </div>
    );
}

// ============ POLARIS BANNER ============
type BannerStatus = 'info' | 'success' | 'warning' | 'critical';

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    status?: BannerStatus;
    onDismiss?: () => void;
    action?: {
        content: string;
        onAction: () => void;
    };
}

export function PolarisBanner({
    title,
    status = 'info',
    onDismiss,
    action,
    children,
    className,
    ...props
}: BannerProps) {
    const statusStyles = {
        info: 'bg-[hsl(var(--p-info-subdued))] border-[hsl(206_100%_75%)]',
        success: 'bg-[hsl(var(--p-success-subdued))] border-[hsl(var(--p-border-success))]',
        warning: 'bg-[hsl(var(--p-warning-subdued))] border-[hsl(39_100%_65%)]',
        critical: 'bg-[hsl(var(--p-critical-subdued))] border-[hsl(var(--p-border-critical))]',
    };

    const iconColors = {
        info: 'text-[hsl(var(--p-text-interactive))]',
        success: 'text-[hsl(var(--p-text-success))]',
        warning: 'text-[hsl(var(--p-text-warning))]',
        critical: 'text-[hsl(var(--p-text-critical))]',
    };

    return (
        <div
            className={cn(
                "p-4 rounded-lg border-l-4",
                statusStyles[status],
                className
            )}
            role="alert"
            {...props}
        >
            <div className="flex items-start gap-3">
                <div className={cn("flex-shrink-0 mt-0.5", iconColors[status])}>
                    {status === 'info' && <InfoIcon />}
                    {status === 'success' && <CheckIcon />}
                    {status === 'warning' && <WarningIcon />}
                    {status === 'critical' && <ErrorIcon />}
                </div>
                <div className="flex-1 min-w-0">
                    {title && (
                        <p className="text-sm font-semibold text-[hsl(var(--p-text))]">{title}</p>
                    )}
                    {children && (
                        <div className="text-sm text-[hsl(var(--p-text))] mt-1">{children}</div>
                    )}
                    {action && (
                        <button
                            onClick={action.onAction}
                            className="mt-2 text-sm font-medium text-[hsl(var(--p-text-interactive))] hover:underline"
                        >
                            {action.content}
                        </button>
                    )}
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
                    >
                        <XIcon className="w-4 h-4 text-[hsl(var(--p-icon-subdued))]" />
                    </button>
                )}
            </div>
        </div>
    );
}

// Simple icons for Banner
function InfoIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 0a10 10 0 1010 10A10 10 0 0010 0zm1 15H9v-2h2zm0-4H9V5h2z" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 0a10 10 0 1010 10A10 10 0 0010 0zm4.3 7.61l-5 6a1 1 0 01-1.52.07l-2.5-2.5a1 1 0 111.42-1.42l1.68 1.68 4.25-5.1a1 1 0 011.58 1.23z" />
        </svg>
    );
}

function WarningIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 0a10 10 0 1010 10A10 10 0 0010 0zm1 15H9v-2h2zm0-4H9V5h2z" />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 0a10 10 0 1010 10A10 10 0 0010 0zm1 15H9v-2h2zm0-4H9V5h2z" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l8 8M14 6l-8 8" />
        </svg>
    );
}

// ============ POLARIS SKELETON ============
interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    className?: string;
}

export function PolarisSkeleton({ width = '100%', height = 20, className }: SkeletonProps) {
    return (
        <div
            className={cn("p-skeleton rounded", className)}
            style={{ width, height }}
        />
    );
}

export function PolarisSkeletonBodyText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <PolarisSkeleton
                    key={i}
                    height={16}
                    width={i === lines - 1 ? '80%' : '100%'}
                />
            ))}
        </div>
    );
}

// ============ POLARIS EMPTY STATE ============
interface EmptyStateProps {
    heading: string;
    image?: React.ReactNode;
    action?: {
        content: string;
        onAction: () => void;
    };
    secondaryAction?: {
        content: string;
        onAction: () => void;
    };
    children?: React.ReactNode;
}

export function PolarisEmptyState({
    heading,
    image,
    action,
    secondaryAction,
    children,
}: EmptyStateProps) {
    return (
        <div className="p-empty-state py-16">
            {image && <div className="mb-6">{image}</div>}
            <h2 className="text-xl font-semibold text-[hsl(var(--p-text))] mb-2">{heading}</h2>
            {children && (
                <p className="text-sm text-[hsl(var(--p-text-subdued))] max-w-md mb-6">{children}</p>
            )}
            {(action || secondaryAction) && (
                <div className="flex items-center gap-3">
                    {action && (
                        <PolarisButton variant="primary" onClick={action.onAction}>
                            {action.content}
                        </PolarisButton>
                    )}
                    {secondaryAction && (
                        <PolarisButton variant="secondary" onClick={secondaryAction.onAction}>
                            {secondaryAction.content}
                        </PolarisButton>
                    )}
                </div>
            )}
        </div>
    );
}

// ============ POLARIS PAGE ============
interface PageProps {
    title: string | React.ReactNode;
    subtitle?: string;
    titleMetadata?: React.ReactNode;
    backAction?: {
        content?: string;
        onAction: () => void;
    };
    primaryAction?: {
        content: string;
        onAction: () => void;
        loading?: boolean;
        disabled?: boolean;
    };
    secondaryActions?: {
        content: string;
        onAction: () => void;
        destructive?: boolean;
        icon?: React.ReactNode;
    }[];
    children: React.ReactNode;
}

export function PolarisPage({
    title,
    subtitle,
    titleMetadata,
    backAction,
    primaryAction,
    secondaryActions,
    children,
}: PageProps) {
    return (
        <div className="p-animate-fade-in">
            {/* Page Header */}
            <div className="mb-6">
                {backAction && (
                    <button
                        onClick={backAction.onAction}
                        className="flex items-center gap-1 text-sm text-[hsl(var(--p-text-subdued))] hover:text-[hsl(var(--p-text))] mb-3"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {backAction.content || 'Back'}
                    </button>
                )}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold text-[hsl(var(--p-text))]">{title}</h1>
                            {titleMetadata}
                        </div>
                        {subtitle && (
                            <p className="text-sm text-[hsl(var(--p-text-subdued))] mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {secondaryActions?.map((action, i) => (
                            <PolarisButton
                                key={i}
                                variant={action.destructive ? 'destructive' : 'secondary'}
                                onClick={action.onAction}
                                icon={action.icon}
                            >
                                {action.content}
                            </PolarisButton>
                        ))}
                        {primaryAction && (
                            <PolarisButton
                                variant="primary"
                                onClick={primaryAction.onAction}
                                loading={primaryAction.loading}
                                disabled={primaryAction.disabled}
                            >
                                {primaryAction.content}
                            </PolarisButton>
                        )}
                    </div>
                </div>
            </div>

            {/* Page Content */}
            {children}
        </div>
    );
}

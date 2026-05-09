'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

// ============ DATA TABLE ============
export interface Column<T> {
    header: string | React.ReactNode;
    accessor: keyof T | ((row: T, index?: number) => React.ReactNode);
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField: keyof T;
    loading?: boolean;
    selectable?: boolean;
    selectedRows?: T[];
    onSelectionChange?: (selected: T[]) => void;
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (column: string, direction: 'asc' | 'desc') => void;
    onRowClick?: (row: T) => void;
    emptyState?: React.ReactNode;
    bulkActions?: {
        content: string;
        onAction: (selected: T[]) => void;
        destructive?: boolean;
    }[];
}

export function PolarisDataTable<T extends object>({
    columns,
    data,
    keyField,
    loading = false,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    sortColumn,
    sortDirection,
    onSort,
    onRowClick,
    emptyState,
    bulkActions,
}: DataTableProps<T>) {
    const allSelected = data.length > 0 && selectedRows.length === data.length;
    const someSelected = selectedRows.length > 0 && !allSelected;

    const handleSelectAll = () => {
        if (allSelected) {
            onSelectionChange?.([]);
        } else {
            onSelectionChange?.([...data]);
        }
    };

    const handleSelectRow = (row: T) => {
        const isSelected = selectedRows.some(r => r[keyField] === row[keyField]);
        if (isSelected) {
            onSelectionChange?.(selectedRows.filter(r => r[keyField] !== row[keyField]));
        } else {
            onSelectionChange?.([...selectedRows, row]);
        }
    };

    const handleSort = (column: Column<T>) => {
        if (!column.sortable || typeof column.accessor !== 'string') return;
        const accessor = column.accessor;
        const newDirection = sortColumn === accessor && sortDirection === 'asc' ? 'desc' : 'asc';
        onSort?.(accessor, newDirection);
    };

    const getCellValue = (row: T, column: Column<T>, index: number) => {
        if (typeof column.accessor === 'function') {
            return column.accessor(row, index);
        }
        return row[column.accessor] as React.ReactNode;
    };

    if (loading) {
        return (
            <div className="grow flex items-center justify-center p-8">
                <div className="inline-flex items-center gap-2 text-sm text-[hsl(var(--p-text-subdued))]">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="grow flex items-center justify-center">
                {emptyState || (
                    <div className="p-12 text-center">
                        <p className="text-sm text-[hsl(var(--p-text-subdued))]">No data available</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col grow">
            {/* Bulk Actions Bar */}
            {selectable && selectedRows.length > 0 && bulkActions && (
                <div className="px-4 py-2 bg-[hsl(var(--p-surface-selected))] border-b border-[hsl(var(--p-border))] flex items-center gap-4">
                    <span className="text-sm font-medium text-[hsl(var(--p-text))]">
                        {selectedRows.length} selected
                    </span>
                    <div className="flex items-center gap-2">
                        {bulkActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => action.onAction(selectedRows)}
                                className={cn(
                                    "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                                    action.destructive
                                        ? "text-[hsl(var(--p-text-critical))] hover:bg-[hsl(var(--p-critical-subdued))]"
                                        : "text-[hsl(var(--p-text-interactive))] hover:bg-[hsl(var(--p-surface-hovered))]"
                                )}
                            >
                                {action.content}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="grow overflow-x-auto">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
                        <tr className="border-b border-[hsl(var(--p-border))]">
                            {selectable && (
                                <th className="w-14 px-4 py-4 bg-[hsl(var(--p-surface-subdued))]">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someSelected;
                                        }}
                                        onChange={handleSelectAll}
                                        className="h-5 w-5 rounded border-[hsl(var(--p-border))] text-[hsl(var(--p-interactive))] focus:ring-[hsl(var(--p-interactive))]"
                                    />
                                </th>
                            )}
                            {columns.map((column, i) => (
                                <th
                                    key={i}
                                    className={cn(
                                        "px-4 py-4 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--p-text-subdued))] bg-[hsl(var(--p-surface-subdued))]",
                                        column.sortable && "cursor-pointer hover:bg-[hsl(var(--p-surface-hovered))]",
                                        column.align === 'center' && "text-center",
                                        column.align === 'right' && "text-right"
                                    )}
                                    style={{ width: column.width }}
                                    onClick={() => handleSort(column)}
                                >
                                    <div className={cn(
                                        "flex items-center gap-1",
                                        column.align === 'center' && "justify-center",
                                        column.align === 'right' && "justify-end"
                                    )}>
                                        {column.header}
                                        {column.sortable && typeof column.accessor === 'string' && sortColumn === column.accessor && (
                                            sortDirection === 'asc' ? (
                                                <ChevronUp className="w-3 h-3" />
                                            ) : (
                                                <ChevronDown className="w-3 h-3" />
                                            )
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => {
                            const isSelected = selectedRows.some(r => r[keyField] === row[keyField]);
                            return (
                                <tr
                                    key={String(row[keyField])}
                                    className={cn(
                                        "border-b border-[hsl(var(--p-border-subdued))] last:border-b-0 transition-colors",
                                        onRowClick && "cursor-pointer",
                                        isSelected
                                            ? "bg-[hsl(var(--p-surface-selected))]"
                                            : "hover:bg-[hsl(var(--p-surface-hovered))]"
                                    )}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {selectable && (
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(row)}
                                                className="h-5 w-5 rounded border-[hsl(var(--p-border))] text-[hsl(var(--p-interactive))] focus:ring-[hsl(var(--p-interactive))]"
                                            />
                                        </td>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={cn(
                                                "px-4 py-4 text-sm text-[hsl(var(--p-text))]",
                                                column.align === 'center' && "text-center",
                                                column.align === 'right' && "text-right"
                                            )}
                                        >
                                            {getCellValue(row, column, rowIndex)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ============ PAGINATION ============
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function PolarisPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[hsl(var(--p-border))] bg-[hsl(var(--p-surface))]">
            <div className="flex items-center gap-4">
                <span className="text-sm text-[hsl(var(--p-text-subdued))]">
                    Showing {startItem}-{endItem} of {totalItems}
                </span>
                {onItemsPerPageChange && (
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="text-sm border border-[hsl(var(--p-border))] rounded-md px-2 py-1 bg-[hsl(var(--p-surface))]"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                )}
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-md hover:bg-[hsl(var(--p-surface-hovered))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                        pageNum = i + 1;
                    } else if (currentPage <= 3) {
                        pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                    } else {
                        pageNum = currentPage - 2 + i;
                    }

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={cn(
                                "min-w-8 h-8 px-2 rounded-md text-sm font-medium transition-colors",
                                currentPage === pageNum
                                    ? "bg-[hsl(var(--p-interactive))] text-white"
                                    : "hover:bg-[hsl(var(--p-surface-hovered))] text-[hsl(var(--p-text-subdued))]"
                            )}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-md hover:bg-[hsl(var(--p-surface-hovered))] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ============ FILTERS ============
interface Filter {
    key: string;
    label: string;
    type: 'select' | 'search' | 'date';
    options?: { label: string; value: string }[];
    value: string;
}

interface FiltersProps {
    filters: Filter[];
    onFilterChange: (key: string, value: string) => void;
    onClear: () => void;
}

export function PolarisFilters({ filters, onFilterChange, onClear }: FiltersProps) {
    const hasActiveFilters = filters.some(f => f.value !== '');

    return (
        <div className="flex flex-wrap items-center gap-3 mb-4">
            {filters.map((filter) => (
                <div key={filter.key}>
                    {filter.type === 'select' && filter.options && (
                        <select
                            value={filter.value}
                            onChange={(e) => onFilterChange(filter.key, e.target.value)}
                            className="text-sm border border-[hsl(var(--p-border))] rounded-lg px-3 py-2 bg-[hsl(var(--p-surface))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--p-interactive))] focus:border-[hsl(var(--p-border-focused))]"
                        >
                            <option value="">{filter.label}</option>
                            {filter.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    )}
                    {filter.type === 'search' && (
                        <input
                            type="text"
                            placeholder={filter.label}
                            value={filter.value}
                            onChange={(e) => onFilterChange(filter.key, e.target.value)}
                            className="text-sm border border-[hsl(var(--p-border))] rounded-lg px-3 py-2 bg-[hsl(var(--p-surface))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--p-interactive))] focus:border-[hsl(var(--p-border-focused))]"
                        />
                    )}
                    {filter.type === 'date' && (
                        <input
                            type="date"
                            value={filter.value}
                            onChange={(e) => onFilterChange(filter.key, e.target.value)}
                            className="text-sm border border-[hsl(var(--p-border))] rounded-lg px-3 py-2 bg-[hsl(var(--p-surface))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--p-interactive))] focus:border-[hsl(var(--p-border-focused))]"
                        />
                    )}
                </div>
            ))}
            {hasActiveFilters && (
                <button
                    onClick={onClear}
                    className="text-sm text-[hsl(var(--p-text-interactive))] hover:underline"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}

// ============ TABS ============
interface Tab {
    id: string;
    content: string;
    badge?: string | number;
}

interface TabsProps {
    tabs: Tab[];
    selected: string;
    onSelect: (id: string) => void;
}

export function PolarisTabs({ tabs, selected, onSelect }: TabsProps) {
    return (
        <div className="border-b border-[hsl(var(--p-border))] mb-4">
            <div className="flex gap-0 -mb-px">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onSelect(tab.id)}
                        className={cn(
                            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                            selected === tab.id
                                ? "border-[hsl(var(--p-interactive))] text-[hsl(var(--p-text))]"
                                : "border-transparent text-[hsl(var(--p-text-subdued))] hover:text-[hsl(var(--p-text))] hover:border-[hsl(var(--p-border))]"
                        )}
                    >
                        <span className="flex items-center gap-2">
                            {tab.content}
                            {tab.badge !== undefined && (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-[hsl(var(--p-surface-subdued))] text-[hsl(var(--p-text-subdued))]">
                                    {tab.badge}
                                </span>
                            )}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ============ ACTION MENU ============
interface ActionMenuItem {
    content: string;
    onAction: () => void;
    destructive?: boolean;
    disabled?: boolean;
}

interface ActionMenuProps {
    items: ActionMenuItem[];
}

export function PolarisActionMenu({ items }: ActionMenuProps) {
    const [open, setOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ top: 0, left: 0, maxHeight: 'none' as string | number, openUpward: false });
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);

    // Wait for client-side mount for portal
    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        const handleScroll = () => {
            if (open) setOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [open]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = 208; // w-52 (13rem)
            const itemHeight = 44; // Approximate height per item (py-3 = 12px*2 + text ~20px)
            const menuPadding = 16; // py-2 = 8px*2
            const estimatedMenuHeight = items.length * itemHeight + menuPadding;
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const spacing = 4;

            // Calculate available space below and above
            const spaceBelow = viewportHeight - rect.bottom - spacing;
            const spaceAbove = rect.top - spacing;

            // Determine if we should open upward
            const openUpward = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

            // Calculate max height based on available space
            const availableSpace = openUpward ? spaceAbove : spaceBelow;
            const maxHeight = Math.min(estimatedMenuHeight, availableSpace - 8);

            // Calculate top position
            let top: number;
            if (openUpward) {
                top = rect.top - Math.min(estimatedMenuHeight, maxHeight) - spacing;
            } else {
                top = rect.bottom + spacing;
            }

            // Calculate left position, ensuring it stays within viewport
            let left = rect.right - menuWidth;
            if (left < 8) left = 8;
            if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;

            setPosition({
                top: Math.max(8, top),
                left,
                maxHeight: maxHeight < estimatedMenuHeight ? maxHeight : 'none',
                openUpward,
            });
        }
        setOpen(!open);
    };

    const dropdownMenu = open && mounted ? (
        <div
            ref={menuRef}
            className="fixed w-52 bg-[hsl(var(--p-surface))] rounded-lg shadow-lg border border-[hsl(var(--p-border))] py-2 z-[9999] overflow-y-auto"
            style={{
                top: position.top,
                left: position.left,
                maxHeight: position.maxHeight,
            }}
        >
            {items.map((item, i) => (
                <button
                    key={i}
                    onClick={(e) => {
                        e.stopPropagation();
                        item.onAction();
                        setOpen(false);
                    }}
                    disabled={item.disabled}
                    className={cn(
                        "w-full px-4 py-3 text-sm text-left transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        item.destructive
                            ? "text-[hsl(var(--p-text-critical))] hover:bg-[hsl(var(--p-critical-subdued))]"
                            : "text-[hsl(var(--p-text))] hover:bg-[hsl(var(--p-surface-hovered))]"
                    )}
                >
                    {item.content}
                </button>
            ))}
        </div>
    ) : null;

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="p-2 rounded-lg hover:bg-[hsl(var(--p-surface-hovered))] transition-colors"
            >
                <MoreHorizontal className="w-5 h-5 text-[hsl(var(--p-icon-subdued))]" />
            </button>

            {mounted && createPortal(dropdownMenu, document.body)}
        </div>
    );
}

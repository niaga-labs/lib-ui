// Warehouse domain components — mobile-first, 44px touch targets, scanner-driven UX.
// Themed via the warehouse palette CSS vars in lib-ui/src/styles/themes/warehouse.css
// (or a consumer-defined override). Components rely on app-level utility classes
// `card`, `card-clickable`, `scanner-input`, `status-badge` and friends — see
// lib-ui/src/styles/themes/warehouse.css for the canonical definitions.

export { default as WarehouseLayout } from './layout/WarehouseLayout';
export { default as BottomNav } from './layout/BottomNav';

export { default as OrderList } from './picking/OrderList';
export { default as PickList } from './picking/PickList';
export { default as LocationGuide } from './picking/LocationGuide';

export { default as StatCard } from './dashboard/StatCard';
export { default as QuickActions } from './dashboard/QuickActions';

export { default as POList } from './receiving/POList';
export { default as ItemScanner } from './receiving/ItemScanner';
export { default as LocationSelector } from './receiving/LocationSelector';

export type {
    Order,
    PickItem,
    PurchaseOrder,
    WarehouseUser,
    WarehouseAuthApi,
} from './types';

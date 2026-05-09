// Shared types for warehouse domain components.
// The warehouse app re-exports these from its lib/api/* modules so existing
// callsites keep working — see frontend-warehouse/src/lib/api/{picking,receiving}.ts.

export interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    priority: 'high' | 'normal' | 'low';
    shippingMethod: 'express' | 'standard' | 'economy';
    status: 'ready_to_pick' | 'picking' | 'picked' | 'packed' | 'shipped';
    itemCount: number;
    pickedCount: number;
    createdAt: string;
    dueDate: string;
}

export interface PickItem {
    id: string;
    sku: string;
    productName: string;
    quantity: number;
    pickedQuantity: number;
    location: string; // Format: Aisle-Rack-Shelf
    status: 'pending' | 'picked';
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    supplier: string;
    expectedDate: string;
    status: 'pending' | 'partial' | 'completed' | 'cancelled';
    itemCount: number;
    receivedCount: number;
    totalValue: number;
    notes?: string;
    createdAt: string;
}

export interface WarehouseUser {
    id: string;
    name: string;
    email: string;
    role: 'warehouse_staff' | 'warehouse_manager' | 'admin';
    warehouseId?: string;
}

// Hook contract WarehouseLayout expects from the consuming app.
// The warehouse app passes its `useAuth` reference via the layout's
// `useAuth` prop, mirroring lib-ui/admin/auth/PermissionGate's pattern.
export interface WarehouseAuthApi {
    user: WarehouseUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
}

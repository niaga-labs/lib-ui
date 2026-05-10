export interface User {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    roles: string[];
    permissions: string[];
    isActive: boolean;
    status: string;
    lastLogin?: string;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserFormData {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    status: string;
    roleIds: string[];
}

// Role descriptor consumed by UserForm's role-picker. Each frontend builds its
// own list (different tenants may expose different roles) and passes it in —
// keeps the form generic and out of any specific permission map.
export interface RoleOption {
    value: string;
    displayName: string;
    description: string;
    color: string;
    permissionCount: number;
}

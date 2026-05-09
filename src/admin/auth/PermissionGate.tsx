'use client';

import { ReactNode } from 'react';

export interface PermissionsApi {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}

interface PermissionGateProps {
  children: ReactNode;

  /**
   * Hook returning the permissions / roles check API. Consumer
   * passes their app's `usePermissions` hook reference here. Rules of
   * Hooks still apply — this hook is called on every render.
   */
  usePermissions: () => PermissionsApi;

  // Permission-based access control
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];

  // Role-based access control
  role?: string;
  anyRoles?: string[];
  allRoles?: string[];

  // Fallback content when user lacks permission
  fallback?: ReactNode;

  // Inverse mode: show content when user DOESN'T have permission
  inverse?: boolean;
}

/**
 * PermissionGate Component
 *
 * Declaratively control UI elements based on user permissions or
 * roles. The consumer injects their app's permissions hook via the
 * `usePermissions` prop.
 *
 * @example
 * ```tsx
 * import { usePermissions } from '@/lib/hooks/usePermissions';
 *
 * <PermissionGate usePermissions={usePermissions} permission="products.create">
 *   <Button>Add Product</Button>
 * </PermissionGate>
 *
 * <PermissionGate usePermissions={usePermissions} anyPermissions={['products.view', 'products.create']}>
 *   <ProductList />
 * </PermissionGate>
 *
 * <PermissionGate usePermissions={usePermissions} role="SUPER_ADMIN">
 *   <AdminPanel />
 * </PermissionGate>
 *
 * <PermissionGate usePermissions={usePermissions} permission="products.view" inverse>
 *   <UpgradePrompt />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({
    children,
    usePermissions,
    permission,
    anyPermissions,
    allPermissions,
    role,
    anyRoles,
    allRoles,
    fallback = null,
    inverse = false,
}: PermissionGateProps) {
    const {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        hasAllRoles,
    } = usePermissions();

    // Determine if user has required access
    let hasAccess = false;

    // Check single permission
    if (permission) {
        hasAccess = hasPermission(permission);
    }
    // Check any of multiple permissions
    else if (anyPermissions) {
        hasAccess = hasAnyPermission(anyPermissions);
    }
    // Check all of multiple permissions
    else if (allPermissions) {
        hasAccess = hasAllPermissions(allPermissions);
    }
    // Check single role
    else if (role) {
        hasAccess = hasRole(role);
    }
    // Check any of multiple roles
    else if (anyRoles) {
        hasAccess = hasAnyRole(anyRoles);
    }
    // Check all of multiple roles
    else if (allRoles) {
        hasAccess = hasAllRoles(allRoles);
    }
    // No permission/role specified - deny by default
    else {
        hasAccess = false;
    }

    // Apply inverse logic if specified
    if (inverse) {
        hasAccess = !hasAccess;
    }

    // Return children if user has access, fallback otherwise
    return hasAccess ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGate;

import {
  ALL_EMPLOYEE_PERMISSIONS,
  type EmployeePermission,
} from './types/employee';

export type AuthLike = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  permissions?: string[];
} | null | undefined;

export type RouteAccess =
  | { type: 'public' }
  | { type: 'admin' }
  | { type: 'permission'; anyOf: EmployeePermission[] };

export const ALL_PERMISSION_KEYS: EmployeePermission[] =
  ALL_EMPLOYEE_PERMISSIONS.map((p) => p.key);

export function userCan(user: AuthLike, permission: EmployeePermission): boolean {
  if (!user?.role) return false;
  if (user.role === 'admin') return true;
  return !!user.permissions?.includes(permission);
}

export function userCanAny(user: AuthLike, permissions: EmployeePermission[]): boolean {
  return permissions.some((p) => userCan(user, p));
}

export function effectivePermissions(user: AuthLike): EmployeePermission[] {
  if (!user?.role) return [];
  if (user.role === 'admin') return [...ALL_PERMISSION_KEYS];
  return (user.permissions || []).filter((p): p is EmployeePermission =>
    ALL_PERMISSION_KEYS.includes(p as EmployeePermission)
  );
}

export function firstAllowedPath(permissions: EmployeePermission[]): string {
  if (permissions.includes('view_stats')) return '/';
  if (permissions.includes('view_plots')) return '/plots';
  if (
    permissions.includes('edit_plots') ||
    permissions.includes('delete_plots')
  ) {
    return '/admin/plots';
  }
  if (permissions.includes('create_plots')) return '/admin/plots/new';
  if (permissions.includes('export_data')) return '/plots';
  return '/no-access';
}

export function getRouteAccess(path: string): RouteAccess {
  const p = normalizePath(path);

  if (
    p.startsWith('/admin/employees') ||
    p.startsWith('/admin/audit') ||
    p === '/admin'
  ) {
    return { type: 'admin' };
  }

  if (p === '/admin/plots/new') {
    return { type: 'permission', anyOf: ['create_plots'] };
  }

  if (/^\/admin\/plots\/\d+\/edit$/.test(p)) {
    return { type: 'permission', anyOf: ['edit_plots'] };
  }

  if (p.startsWith('/admin/plots') || p.startsWith('/admin')) {
    return {
      type: 'permission',
      anyOf: ['edit_plots', 'create_plots', 'delete_plots'],
    };
  }

  if (/^\/contracts\/\d+\/edit$/.test(p)) {
    return { type: 'permission', anyOf: ['edit_contracts'] };
  }

  if (p.startsWith('/contracts')) {
    return { type: 'permission', anyOf: ['view_contracts', 'edit_contracts'] };
  }

  return { type: 'public' };
}

/** Extra permission an employee needs on otherwise-public pages. Guests are unaffected. */
export function employeePermissionForPublicPath(
  path: string
): EmployeePermission[] | null {
  const p = normalizePath(path);

  if (p === '/') return ['view_stats'];

  if (/^\/plots\/\d+/.test(p)) {
    return ['view_plots', 'view_contracts', 'edit_plots'];
  }

  if (
    p.startsWith('/plots') ||
    p.startsWith('/blocks') ||
    p.startsWith('/zones') ||
    p.startsWith('/quote')
  ) {
    return ['view_plots'];
  }

  return null;
}

function normalizePath(path: string): string {
  if (!path) return '/';
  const cleaned = path.split('?')[0].replace(/\/+$/, '');
  return cleaned || '/';
}

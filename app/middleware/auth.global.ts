import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useRuntimeConfig,
} from 'nuxt/app';

import {
  employeePermissionForPublicPath,
  firstAllowedPath,
  getRouteAccess,
  userCanAny,
} from '../../shared/access';

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();

  const loginPath = String(config.public.loginPath || '/login');
  const employeeLoginPath = String(
    config.public.employeeLoginPath || '/portal'
  );
  const homePath = '/';

  // 1. Routes accessible without authentication
  const openPaths = new Set([
    homePath, // <-- homepage is public, so logout can land here
    loginPath,
    employeeLoginPath,
    '/no-access',
  ]);

  if (openPaths.has(to.path)) {
    return;
  }

  // 2. Load authentication state
  const { refreshAuth, user, isAdmin, isEmployee, permissions } =
    useAuthSession();

  if (!user.value) {
    await refreshAuth();
  }

  // 3. Not logged in -> login page
  if (!user.value) {
    return navigateTo(loginPath, { replace: true });
  }

  // 4. Admin: full access
  if (isAdmin.value) {
    return;
  }

  // 5. Authenticated but no valid role
  if (!isEmployee.value) {
    return navigateTo(loginPath, { replace: true });
  }

  // Helper to avoid repeating the fallback logic
  const redirectToFallback = () => {
    const fallback = firstAllowedPath(permissions.value);

    if (fallback && fallback !== to.path) {
      return navigateTo(fallback, { replace: true });
    }

    return navigateTo('/no-access', { replace: true });
  };

  // 6. Determine route access requirements
  const access = getRouteAccess(to.path);

  // 7. Admin-only routes
  if (access.type === 'admin') {
    return redirectToFallback();
  }

  // 8. Routes with explicit permission requirements
  if (access.type === 'permission') {
    return userCanAny(user.value, access.anyOf)
      ? undefined
      : redirectToFallback();
  }

  // 9. Employee public/application routes (unknown routes denied by default)
  const requiredPermissions = employeePermissionForPublicPath(to.path);

  if (!requiredPermissions?.length) {
    return navigateTo('/no-access', { replace: true });
  }

  if (userCanAny(user.value, requiredPermissions)) {
    return;
  }

  // 10. Unauthorized employee
  return redirectToFallback();
});``
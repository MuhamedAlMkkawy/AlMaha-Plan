import {
  H3Event,
  createError,
  getCookie,
  getHeader,
} from 'h3';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { EmployeePermission } from '../../shared/types/employee';
import { EmployeesRepository } from '../services/employees/employees.repository';
import { userCan } from '../../shared/access';

export interface AuthUser {
  id?: string;
  email: string;
  name?: string;
  role: 'admin' | 'employee';
  permissions?: EmployeePermission[];
}

export type AdminUser = AuthUser & { role: 'admin' };

const ADMIN_COOKIE_NAME = 'maha_admin_session';
const EMPLOYEE_COOKIE_NAME = 'maha_employee_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    // Development fallback if not set
    return process.env.AUTH_SECRET_FALLBACK || 'maha-plan-secret-key-at-least-32-chars-long-2026';
  }
  return secret;
}

export function isAllowedAdminEmail(email: string): boolean {
  if (!email) return false;

  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length === 0) return true; // If empty in dev, allow admin
  return allowed.includes(email.trim().toLowerCase());
}

function signPayload(payload: string): string {
  return createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');
}

function verifyAndDecodeToken(token: string): any | null {
  try {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    const expectedSignature = signPayload(payload);
    const actualBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      actualBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      return null;
    }

    const parsed = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    );

    if (typeof parsed.exp !== 'number' || parsed.exp < Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getAuthSession(event: H3Event): AuthUser | null {
  const adminCookie = getCookie(event, ADMIN_COOKIE_NAME);
  const empCookie = getCookie(event, EMPLOYEE_COOKIE_NAME);
  const authHeader = getHeader(event, 'authorization');

  const token =
    adminCookie ||
    empCookie ||
    (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!token) return null;

  const parsed = verifyAndDecodeToken(token);
  if (!parsed || !parsed.role) return null;

  if (parsed.role === 'admin') {
    if (!parsed.email || !isAllowedAdminEmail(parsed.email)) return null;
    return {
      email: parsed.email,
      name: parsed.name || 'مدير النظام',
      role: 'admin',
    };
  }

  if (parsed.role === 'employee') {
    return {
      id: parsed.id,
      email: parsed.email || parsed.username,
      name: parsed.name || 'موظف',
      role: 'employee',
      permissions: parsed.permissions || [],
    };
  }

  return null;
}

export function getAdminSession(event: H3Event): AdminUser | null {
  const session = getAuthSession(event);
  if (session && session.role === 'admin') {
    return session as AdminUser;
  }
  return null;
}

export function createAdminSessionToken(user: {
  email: string;
  name?: string;
}): string {
  const payload = Buffer.from(
    JSON.stringify({
      email: user.email,
      name: user.name || 'مدير النظام',
      role: 'admin',
      exp: Date.now() + SESSION_DURATION,
    })
  ).toString('base64url');

  return `${payload}.${signPayload(payload)}`;
}

export function createEmployeeSessionToken(emp: {
  id: string;
  name: string;
  username: string;
  permissions: EmployeePermission[];
}): string {
  const payload = Buffer.from(
    JSON.stringify({
      id: emp.id,
      email: emp.username,
      name: emp.name,
      role: 'employee',
      permissions: emp.permissions,
      exp: Date.now() + SESSION_DURATION,
    })
  ).toString('base64url');

  return `${payload}.${signPayload(payload)}`;
}

export function requireAdmin(event: H3Event): AdminUser {
  const session = getAdminSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'غير مصرح - صلاحية مسؤول مطلوبة',
    });
  }

  return session;
}

/**
 * Re-reads the employee record so revoked/changed permissions take effect
 * immediately, even if the cookie was issued earlier.
 */
export async function getLiveAuthSession(event: H3Event): Promise<AuthUser | null> {
  const session = getAuthSession(event);
  if (!session) return null;

  if (session.role !== 'employee') {
    return session;
  }

  if (!session.id) return null;

  const employee = await EmployeesRepository.getEmployeeById(session.id);
  if (!employee || employee.status !== 'active') {
    return null;
  }

  return {
    id: employee.id,
    email: employee.username,
    name: employee.name,
    role: 'employee',
    permissions: employee.permissions || [],
  };
}

export async function requirePermission(
  event: H3Event,
  permission: EmployeePermission
): Promise<AuthUser> {
  const user = await getLiveAuthSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'يرجى تسجيل الدخول أولاً',
    });
  }

  if (!userCan(user, permission)) {
    throw createError({
      statusCode: 403,
      statusMessage: `غير مصرح - ليس لديك صلاحية تنفيذ هذا الإجراء (${permission})`,
    });
  }

  return user;
}

/** Guests stay allowed; logged-in employees must hold the given permission. */
export async function enforceEmployeePermissionIfLoggedIn(
  event: H3Event,
  permission: EmployeePermission
): Promise<AuthUser | null> {
  const user = await getLiveAuthSession(event);
  if (!user) return null;
  if (user.role === 'admin') return user;

  if (!userCan(user, permission)) {
    throw createError({
      statusCode: 403,
      statusMessage: `غير مصرح - ليس لديك صلاحية تنفيذ هذا الإجراء (${permission})`,
    });
  }

  return user;
}

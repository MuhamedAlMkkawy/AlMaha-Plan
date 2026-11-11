
import {
  H3Event,
  createError,
  getCookie,
  getHeader,
} from 'h3';
import { createHmac, timingSafeEqual } from 'node:crypto';

export interface AdminUser {
  email: string;
  name?: string;
  role: 'admin';
}

const AUTH_COOKIE_NAME = 'maha_admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be at least 32 characters');
  }

  return secret;
}

export function isAllowedAdminEmail(email: string): boolean {
  if (!email) return false;

  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.trim().toLowerCase());
}

function signPayload(payload: string): string {
  return createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');
}

export function getAdminSession(event: H3Event): AdminUser | null {
  const cookieVal = getCookie(event, AUTH_COOKIE_NAME);
  const authHeader = getHeader(event, 'authorization');

  const token =
    cookieVal ||
    (authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null);

  if (!token) return null;

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

    if (
      !parsed.email ||
      parsed.role !== 'admin' ||
      !isAllowedAdminEmail(parsed.email) ||
      typeof parsed.exp !== 'number' ||
      parsed.exp < Date.now()
    ) {
      return null;
    }

    return {
      email: parsed.email,
      name: parsed.name || 'مدير النظام',
      role: 'admin',
    };
  } catch {
    return null;
  }
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

export function requireAdmin(event: H3Event): AdminUser {
  const session = getAdminSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'غير مصرح - يرجى تسجيل الدخول أولاً',
    });
  }

  return session;
}

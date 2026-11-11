
import {
  defineEventHandler,
  readBody,
  createError,
  setCookie,
} from 'h3';

import {
  isAllowedAdminEmail,
  createAdminSessionToken,
} from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'يرجى إدخال البريد الإلكتروني وكلمة المرور',
    });
  }

  if (!isAllowedAdminEmail(email)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    });
  }

  const token = createAdminSessionToken({
    email,
    name: 'مدير المبيعات',
  });

  setCookie(event, 'maha_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60,
  });

  return {
    success: true,
    user: {
      email,
      name: 'مدير المبيعات',
      role: 'admin',
    },
  };
});

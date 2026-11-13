import {
  defineEventHandler,
  readBody,
  createError,
  setCookie,
} from 'h3';
import { EmployeesRepository } from '../../services/employees/employees.repository';
import { createEmployeeSessionToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const username = String(body?.username || '').trim().toLowerCase();
  const password = String(body?.password || '');

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'يرجى إدخال اسم المستخدم وكلمة المرور',
    });
  }

  const employee = await EmployeesRepository.getEmployeeByUsername(username);

  if (!employee || employee.password !== password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'اسم المستخدم أو كلمة المرور غير صحيحة',
    });
  }

  if (employee.status !== 'active') {
    throw createError({
      statusCode: 403,
      statusMessage: 'حساب الموظف معطل حالياً. يرجى مراجعة إدارة النظام.',
    });
  }

  const clientIp = event.node.req.socket.remoteAddress || '';
  await EmployeesRepository.recordLogin(employee.id, clientIp);

  const token = createEmployeeSessionToken({
    id: employee.id,
    name: employee.name,
    username: employee.username,
    permissions: employee.permissions,
  });

  setCookie(event, 'maha_employee_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60,
  });

  return {
    success: true,
    user: {
      id: employee.id,
      name: employee.name,
      username: employee.username,
      title: employee.title,
      role: 'employee',
      permissions: employee.permissions,
    },
  };
});


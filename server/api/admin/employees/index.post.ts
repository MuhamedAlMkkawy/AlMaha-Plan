import { defineEventHandler, readBody, createError } from 'h3';
import { requireAdmin } from '../../../utils/auth';
import { EmployeesRepository } from '../../../services/employees/employees.repository';
import type { CreateEmployeeInput } from '../../../../shared/types/employee';

export default defineEventHandler(async (event) => {
  const admin = requireAdmin(event);
  const body = await readBody<CreateEmployeeInput>(event);

  if (!body?.name?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'يرجى إدخال اسم الموظف' });
  }

  if (!body?.username?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'يرجى إدخال اسم المستخدم أو البريد' });
  }

  if (!body?.password || body.password.length < 4) {
    throw createError({ statusCode: 400, statusMessage: 'كلمة المرور يجب أن لا تقل عن 4 خانات' });
  }

  const clientIp = event.node.req.socket.remoteAddress || '';
  const newEmp = await EmployeesRepository.createEmployee(body, admin.email, clientIp);

  return {
    success: true,
    message: 'تم إضافة الموظف بنجاح',
    data: newEmp,
  };
});


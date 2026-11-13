import { defineEventHandler, getRouterParam, createError } from 'h3';
import { requireAdmin } from '../../../utils/auth';
import { EmployeesRepository } from '../../../services/employees/employees.repository';

export default defineEventHandler(async (event) => {
  const admin = requireAdmin(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'معرف الموظف مطلوب' });
  }

  const clientIp = event.node.req.socket.remoteAddress || '';
  const ok = await EmployeesRepository.deleteEmployee(id, admin.email, clientIp);

  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: 'الموظف غير موجود' });
  }

  return {
    success: true,
    message: 'تم حذف الموظف بنجاح',
  };
});


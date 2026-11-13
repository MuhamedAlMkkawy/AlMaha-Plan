import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { requireAdmin } from '../../../utils/auth';
import { EmployeesRepository } from '../../../services/employees/employees.repository';
import type { UpdateEmployeeInput } from '../../../../shared/types/employee';

export default defineEventHandler(async (event) => {
  const admin = requireAdmin(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'معرف الموظف مطلوب' });
  }

  const body = await readBody<UpdateEmployeeInput>(event);
  const clientIp = event.node.req.socket.remoteAddress || '';

  const updated = await EmployeesRepository.updateEmployee(id, body, admin.email, clientIp);

  return {
    success: true,
    message: 'تم تحديث بيانات الموظف بنجاح',
    data: updated,
  };
});


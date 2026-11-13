import { defineEventHandler } from 'h3';
import { requireAdmin } from '../../../utils/auth';
import { EmployeesRepository } from '../../../services/employees/employees.repository';

export default defineEventHandler(async (event) => {
  requireAdmin(event);
  const list = await EmployeesRepository.getAllEmployees(true);
  return {
    success: true,
    data: list,
  };
});


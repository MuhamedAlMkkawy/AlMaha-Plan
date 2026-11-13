import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler((event) => {
  deleteCookie(event, 'maha_admin_session', { path: '/' });
  deleteCookie(event, 'maha_employee_session', { path: '/' });
  return {
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
  };
});

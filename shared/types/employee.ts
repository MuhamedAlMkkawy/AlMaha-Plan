export type EmployeePermission =
  | 'view_plots'
  | 'edit_plots'
  | 'create_plots'
  | 'delete_plots'
  | 'view_contracts'
  | 'edit_contracts'
  | 'view_stats'
  | 'export_data';

export interface EmployeePermissionDef {
  key: EmployeePermission;
  label: string;
  description: string;
}

export const ALL_EMPLOYEE_PERMISSIONS: EmployeePermissionDef[] = [
  { key: 'view_plots', label: 'استعراض القطع', description: 'إمكانية تصفح والبحث في جدول القطع الكامل' },
  { key: 'edit_plots', label: 'تعديل القطع', description: 'تعديل تفاصيل القطعة وتغيير حالة البيع (متاح / محجوز / مباع)' },
  { key: 'create_plots', label: 'إضافة قطع', description: 'إضافة قطع وأراضي جديدة إلى المخطط' },
  { key: 'delete_plots', label: 'أرشفة القطع', description: 'حذف أو أرشفة القطع من النظام' },
  { key: 'view_contracts', label: 'استعراض العقود', description: 'الاطلاع على عقود الشراء وطباعتها' },
  { key: 'edit_contracts', label: 'تحرير العقود', description: 'تعديل بيانات المشتري وبيانات العقد والشروط وحفظها' },
  { key: 'view_stats', label: 'لوحة الإحصائيات', description: 'عرض مؤشرات المبيعات وتحليلات الاستخدام والمخططات' },
  { key: 'export_data', label: 'تصدير البيانات', description: 'تصدير بيانات القطع بصيغة CSV أو Excel' },
];

export interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'employee';
  status: 'active' | 'inactive';
  permissions: EmployeePermission[];
  title?: string;
  phone?: string;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface CreateEmployeeInput {
  name: string;
  username: string;
  password: string;
  title?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  permissions: EmployeePermission[];
}

export interface UpdateEmployeeInput {
  name?: string;
  username?: string;
  password?: string;
  title?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  permissions?: EmployeePermission[];
}


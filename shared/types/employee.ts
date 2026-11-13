
export type EmployeePermission =
  | 'view_plots'
  | 'edit_plots'
  | 'create_plots'
  | 'delete_plots'
  | 'view_contracts'
  | 'edit_contracts'
  | 'view_stats'
  | 'export_data'
  | 'view_plot_page'
  | 'edit_plot_page'
  | 'create_plot_page'
  | 'delete_plot_page'
  | 'view_zone_page'
  | 'edit_zone_page'
  | 'create_zone_page'
  | 'delete_zone_page'
  | 'view_block_page'
  | 'edit_block_page'
  | 'create_block_page'
  | 'delete_block_page';

export interface EmployeePermissionDef {
  key: EmployeePermission;
  label: string;
  description: string;
}

export const ALL_EMPLOYEE_PERMISSIONS: EmployeePermissionDef[] = [
  { key: 'view_plots', label: 'استعراض القطع', description: 'تصفح والبحث في جدول القطع' },
  { key: 'create_plots', label: 'إضافة قطع', description: 'إضافة قطع وأراضٍ جديدة' },
  { key: 'edit_plots', label: 'تعديل القطع', description: 'تعديل البيانات وحالة البيع' },
  { key: 'delete_plots', label: 'حذف القطع', description: 'حذف أو أرشفة القطع' },

  { key: 'view_plot_page', label: 'عرض صفحة القطعة', description: 'مشاهدة تفاصيل القطعة' },
  { key: 'create_plot_page', label: 'إنشاء صفحة قطعة', description: 'إنشاء قطعة من صفحة الإدخال' },
  { key: 'edit_plot_page', label: 'تعديل صفحة القطعة', description: 'تحرير تفاصيل القطعة' },
  { key: 'delete_plot_page', label: 'حذف صفحة قطعة', description: 'حذف أو أرشفة القطعة' },

  { key: 'view_zone_page', label: 'عرض المناطق', description: 'مشاهدة تفاصيل المناطق' },
  { key: 'create_zone_page', label: 'إضافة منطقة', description: 'إنشاء منطقة جديدة' },
  { key: 'edit_zone_page', label: 'تعديل المنطقة', description: 'تعديل بيانات المنطقة' },
  { key: 'delete_zone_page', label: 'حذف المنطقة', description: 'حذف أو أرشفة المنطقة' },

  { key: 'view_block_page', label: 'عرض البلوكات', description: 'مشاهدة تفاصيل البلوكات' },
  { key: 'create_block_page', label: 'إضافة بلوك', description: 'إنشاء بلوك جديد' },
  { key: 'edit_block_page', label: 'تعديل البلوك', description: 'تحرير بيانات البلوك' },
  { key: 'delete_block_page', label: 'حذف البلوك', description: 'حذف أو أرشفة البلوك' },

  { key: 'view_contracts', label: 'استعراض العقود', description: 'الاطلاع على العقود وطباعتها' },
  { key: 'edit_contracts', label: 'تحرير العقود', description: 'تعديل بيانات العقود وشروطها' },
  { key: 'view_stats', label: 'الإحصائيات', description: 'عرض مؤشرات المبيعات والتحليلات' },
  { key: 'export_data', label: 'تصدير البيانات', description: 'تصدير البيانات بصيغة CSV أو Excel' },
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
  title: string;
  username: string;
  password: string;
  phone?: string;
  status?: 'active' | 'inactive';
  permissions: EmployeePermission[];
}

export interface UpdateEmployeeInput {
  name?: string;
  title?: string;
  username?: string;
  password?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  permissions?: EmployeePermission[];
}

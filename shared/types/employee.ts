export type EmployeePermission =
  | 'view_plots'
  | 'edit_plots'
  | 'create_plots'
  | 'delete_plots'
  | 'view_contracts'
  | 'edit_contracts'
  | 'view_stats'
  | 'export_data'
  // New granular page permissions
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
  { key: 'view_plots', label: 'استعراض القطع', description: 'إمكانية تصفح والبحث في جدول القطع الكامل' },
  { key: 'edit_plots', label: 'تعديل القطع', description: 'تعديل تفاصيل القطعة وتغيير حالة البيع (متاح / محجوز / مباع)' },
  { key: 'create_plots', label: 'إضافة قطع', description: 'إضافة قطع وأراضي جديدة إلى المخطط' },
  { key: 'delete_plots', label: 'أرشفة القطع', description: 'حذف أو أرشفة القطع من النظام' },
  { key: 'view_contracts', label: 'استعراض العقود', description: 'الاطلاع على عقود الشراء وطباعتها' },
  { key: 'edit_contracts', label: 'تحرير العقود', description: 'تعديل بيانات المشتري وبيانات العقد والشروط وحفظها' },
  { key: 'view_stats', label: 'لوحة الإحصائيات', description: 'عرض مؤشرات المبيعات وتحليلات الاستخدام والمخططات' },
  { key: 'export_data', label: 'تصدير البيانات', description: 'تصدير بيانات القطع بصيغة CSV أو Excel' },
  { key: 'view_plot_page', label: 'عرض صفحة القطعة', description: 'مشاهدة صفحة تفاصيل القطعة الفردية' },
  { key: 'edit_plot_page', label: 'تعديل صفحة القطعة', description: 'تحرير تفاصيل القطعة من صفحة العرض الفردية' },
  { key: 'create_plot_page', label: 'إنشاء صفحة قطعة', description: 'إنشاء قطعة جديدة عبر صفحة الإدخال' },
  { key: 'delete_plot_page', label: 'حذف صفحة قطعة', description: 'حذف أو أرشفة قطعة من صفحة العرض الفردية' },
  { key: 'view_zone_page', label: 'عرض صفحة المنطقة', description: 'مشاهدة تفاصيل المنطقة' },
  { key: 'edit_zone_page', label: 'تعديل صفحة المنطقة', description: 'تعديل بيانات المنطقة' },
  { key: 'create_zone_page', label: 'إنشاء صفحة منطقة', description: 'إنشاء منطقة جديدة' },
  { key: 'delete_zone_page', label: 'حذف صفحة منطقة', description: 'حذف أو أرشفة منطقة' },
  { key: 'view_block_page', label: 'عرض صفحة البلوك', description: 'مشاهدة تفاصيل البلوك' },
  { key: 'edit_block_page', label: 'تعديل صفحة البلوك', description: 'تحرير بيانات البلوك' },
  { key: 'create_block_page', label: 'إنشاء صفحة بلوك', description: 'إنشاء بلوك جديد' },
  { key: 'delete_block_page', label: 'حذف صفحة بلوك', description: 'حذف أو أرشفة بلوك' },
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
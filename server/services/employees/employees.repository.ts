import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { GoogleSheetsClient } from '../../utils/google-sheets/client';
import { AuditService } from '../audit/audit.service';
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput, EmployeePermission } from '../../../shared/types/employee';

const EMPLOYEES_FILE = path.resolve(process.cwd(), 'server/data/employees.json');
const SHEET_ID = process.env.SHEET_ID || '1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A';
const EMPLOYEES_TAB = 'Employees';

let inMemoryEmployees: Map<string, Employee> | null = null;
let lastLoadedTime = 0;
const CACHE_TTL_MS = 60 * 1000;

export class EmployeesRepository {
  private static loadFromFile(): Map<string, Employee> {
    const map = new Map<string, Employee>();
    try {
      if (fs.existsSync(EMPLOYEES_FILE)) {
        const raw = fs.readFileSync(EMPLOYEES_FILE, 'utf8');
        const list: Employee[] = JSON.parse(raw);
        for (const emp of list) {
          if (emp && emp.id) {
            map.set(emp.id, emp);
          }
        }
      }
    } catch (err) {
      console.warn('[EmployeesRepository] Failed to read local employees file:', err);
    }
    return map;
  }

  private static saveToFile(map: Map<string, Employee>) {
    try {
      const list = Array.from(map.values());
      const dir = path.dirname(EMPLOYEES_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
      console.warn('[EmployeesRepository] Failed to save local employees file:', err);
    }
  }

  public static async getAllEmployees(forceRefresh = false): Promise<Employee[]> {
    const now = Date.now();
    if (!forceRefresh && inMemoryEmployees && now - lastLoadedTime < CACHE_TTL_MS) {
      return Array.from(inMemoryEmployees.values());
    }

    const map = this.loadFromFile();
    const client = GoogleSheetsClient.getClient();

    if (client) {
      try {
        await GoogleSheetsClient.ensureTabExists(SHEET_ID, EMPLOYEES_TAB);
        const rows = await GoogleSheetsClient.getValues(SHEET_ID, `${EMPLOYEES_TAB}!A2:L`);
        if (rows && rows.length > 0) {
          for (const r of rows) {
            const id = r[0];
            if (!id) continue;

            let permissions: EmployeePermission[] = [];
            if (r[6]) {
              try {
                permissions = JSON.parse(r[6]);
              } catch {
                permissions = [];
              }
            }

            const emp: Employee = {
              id,
              name: r[1] || '',
              username: (r[2] || '').trim().toLowerCase(),
              password: r[3] || '',
              role: 'employee',
              status: (r[5] === 'inactive' ? 'inactive' : 'active'),
              permissions,
              title: r[7] || '',
              phone: r[8] || '',
              createdAt: r[9] || new Date().toISOString(),
              updatedAt: r[10] || '',
              lastLoginAt: r[11] || '',
            };
            map.set(id, emp);
          }
        }
      } catch (err) {
        console.warn('[EmployeesRepository] Error fetching employees from Google Sheets:', err);
      }
    }

    inMemoryEmployees = map;
    lastLoadedTime = now;
    return Array.from(map.values());
  }

  public static async getEmployeeById(id: string): Promise<Employee | null> {
    const list = await this.getAllEmployees();
    return list.find((e) => e.id === id) || null;
  }

  public static async getEmployeeByUsername(username: string): Promise<Employee | null> {
    const clean = (username || '').trim().toLowerCase();
    const list = await this.getAllEmployees();
    return list.find((e) => e.username === clean) || null;
  }

  public static async createEmployee(
    input: CreateEmployeeInput,
    adminEmail: string,
    ipAddress?: string
  ): Promise<Employee> {
    const cleanUsername = input.username.trim().toLowerCase();
    const existing = await this.getEmployeeByUsername(cleanUsername);
    if (existing) {
      const err = new Error(`اسم المستخدم "${cleanUsername}" مستخدم مسبقاً.`);
      (err as any).statusCode = 400;
      throw err;
    }

    const id = 'emp_' + crypto.randomBytes(6).toString('hex');
    const now = new Date().toISOString();

    const newEmp: Employee = {
      id,
      name: input.name.trim(),
      username: cleanUsername,
      password: input.password,
      role: 'employee',
      status: input.status || 'active',
      permissions: input.permissions || [],
      title: input.title?.trim() || 'موظف مبيعات',
      phone: input.phone?.trim() || '',
      createdAt: now,
    };

    // 1. Google Sheets sync
    const client = GoogleSheetsClient.getClient();
    if (client) {
      try {
        await GoogleSheetsClient.ensureTabExists(SHEET_ID, EMPLOYEES_TAB);
        const headerCheck = await GoogleSheetsClient.getValues(SHEET_ID, `${EMPLOYEES_TAB}!A1:L1`);
        if (!headerCheck || headerCheck.length === 0 || !headerCheck[0] || headerCheck[0].length === 0) {
          await GoogleSheetsClient.updateValues(SHEET_ID, `${EMPLOYEES_TAB}!A1:L1`, [
            ['ID', 'الاسم', 'اسم المستخدم', 'كلمة المرور', 'الدور', 'الحالة', 'الصلاحيات', 'المسمى الوظيفي', 'رقم الهاتف', 'تاريخ الإنشاء', 'تاريخ التحديث', 'آخر دخول'],
          ]);
        }

        const row = [
          newEmp.id,
          newEmp.name,
          newEmp.username,
          newEmp.password,
          newEmp.role,
          newEmp.status,
          JSON.stringify(newEmp.permissions),
          newEmp.title || '',
          newEmp.phone || '',
          newEmp.createdAt,
          '',
          '',
        ];
        await GoogleSheetsClient.appendValues(SHEET_ID, `${EMPLOYEES_TAB}!A:L`, [row]);
      } catch (err) {
        console.error('[EmployeesRepository] Error writing new employee to Google Sheets:', err);
      }
    }

    // 2. In-memory & local file sync
    const map = inMemoryEmployees || this.loadFromFile();
    map.set(id, newEmp);
    inMemoryEmployees = map;
    this.saveToFile(map);

    // 3. Audit log
    await AuditService.log({
      adminEmail,
      userName: adminEmail,
      userRole: 'admin',
      action: 'EMPLOYEE_CREATE',
      target: `إضافة موظف: ${newEmp.name} (${newEmp.username})`,
      afterData: JSON.stringify({
        id: newEmp.id,
        name: newEmp.name,
        username: newEmp.username,
        title: newEmp.title,
        status: newEmp.status,
        permissions: newEmp.permissions,
      }),
      ipAddress,
    });

    return newEmp;
  }

  public static async updateEmployee(
    id: string,
    input: UpdateEmployeeInput,
    adminEmail: string,
    ipAddress?: string
  ): Promise<Employee> {
    const current = await this.getEmployeeById(id);
    if (!current) {
      const err = new Error('الموظف غير موجود');
      (err as any).statusCode = 404;
      throw err;
    }

    if (input.username && input.username.trim().toLowerCase() !== current.username) {
      const clean = input.username.trim().toLowerCase();
      const duplicate = await this.getEmployeeByUsername(clean);
      if (duplicate && duplicate.id !== id) {
        const err = new Error(`اسم المستخدم "${clean}" مستخدم مسبقاً.`);
        (err as any).statusCode = 400;
        throw err;
      }
    }

    const beforeData = JSON.stringify(current);
    const now = new Date().toISOString();

    const updated: Employee = {
      ...current,
      name: input.name !== undefined ? input.name.trim() : current.name,
      username: input.username !== undefined ? input.username.trim().toLowerCase() : current.username,
      password: input.password !== undefined && input.password ? input.password : current.password,
      status: input.status !== undefined ? input.status : current.status,
      permissions: input.permissions !== undefined ? input.permissions : current.permissions,
      title: input.title !== undefined ? input.title.trim() : current.title,
      phone: input.phone !== undefined ? input.phone.trim() : current.phone,
      updatedAt: now,
    };

    // 1. Google Sheets sync
    const client = GoogleSheetsClient.getClient();
    if (client) {
      try {
        await GoogleSheetsClient.ensureTabExists(SHEET_ID, EMPLOYEES_TAB);
        const rows = await GoogleSheetsClient.getValues(SHEET_ID, `${EMPLOYEES_TAB}!A:A`);
        let foundRow = -1;
        for (let i = 1; i < rows.length; i++) {
          if (rows[i]?.[0] === id) {
            foundRow = i + 1;
            break;
          }
        }

        const rowValues = [
          [
            updated.id,
            updated.name,
            updated.username,
            updated.password,
            updated.role,
            updated.status,
            JSON.stringify(updated.permissions),
            updated.title || '',
            updated.phone || '',
            updated.createdAt,
            updated.updatedAt,
            updated.lastLoginAt || '',
          ],
        ];

        if (foundRow > 0) {
          await GoogleSheetsClient.updateValues(SHEET_ID, `${EMPLOYEES_TAB}!A${foundRow}:L${foundRow}`, rowValues);
        } else {
          await GoogleSheetsClient.appendValues(SHEET_ID, `${EMPLOYEES_TAB}!A:L`, rowValues);
        }
      } catch (err) {
        console.error('[EmployeesRepository] Error updating employee in Google Sheets:', err);
      }
    }

    // 2. In-memory & local file sync
    const map = inMemoryEmployees || this.loadFromFile();
    map.set(id, updated);
    inMemoryEmployees = map;
    this.saveToFile(map);

    // 3. Audit log
    await AuditService.log({
      adminEmail,
      userName: adminEmail,
      userRole: 'admin',
      action: 'EMPLOYEE_UPDATE',
      target: `تعديل موظف: ${updated.name} (${updated.username})`,
      beforeData,
      afterData: JSON.stringify({
        id: updated.id,
        name: updated.name,
        username: updated.username,
        title: updated.title,
        status: updated.status,
        permissions: updated.permissions,
      }),
      ipAddress,
    });

    return updated;
  }

  public static async deleteEmployee(id: string, adminEmail: string, ipAddress?: string): Promise<boolean> {
    const current = await this.getEmployeeById(id);
    if (!current) return false;

    // Soft-deactivate or delete
    const map = inMemoryEmployees || this.loadFromFile();
    map.delete(id);
    inMemoryEmployees = map;
    this.saveToFile(map);

    // Update in Google Sheet (mark as deleted/inactive or update row)
    const client = GoogleSheetsClient.getClient();
    if (client) {
      try {
        const rows = await GoogleSheetsClient.getValues(SHEET_ID, `${EMPLOYEES_TAB}!A:A`);
        for (let i = 1; i < rows.length; i++) {
          if (rows[i]?.[0] === id) {
            const rowIndex = i + 1;
            // Mark status column (col F = index 6) as deleted
            await GoogleSheetsClient.updateValues(SHEET_ID, `${EMPLOYEES_TAB}!F${rowIndex}`, [['deleted']]);
            break;
          }
        }
      } catch (err) {
        console.error('[EmployeesRepository] Error deleting employee row in Google Sheets:', err);
      }
    }

    await AuditService.log({
      adminEmail,
      userName: adminEmail,
      userRole: 'admin',
      action: 'EMPLOYEE_DELETE',
      target: `حذف موظف: ${current.name} (${current.username})`,
      beforeData: JSON.stringify(current),
      ipAddress,
    });

    return true;
  }

  public static async recordLogin(id: string, ipAddress?: string): Promise<void> {
    const emp = await this.getEmployeeById(id);
    if (!emp) return;

    const now = new Date().toISOString();
    emp.lastLoginAt = now;

    const map = inMemoryEmployees || this.loadFromFile();
    map.set(id, emp);
    this.saveToFile(map);

    const client = GoogleSheetsClient.getClient();
    if (client) {
      try {
        const rows = await GoogleSheetsClient.getValues(SHEET_ID, `${EMPLOYEES_TAB}!A:A`);
        for (let i = 1; i < rows.length; i++) {
          if (rows[i]?.[0] === id) {
            await GoogleSheetsClient.updateValues(SHEET_ID, `${EMPLOYEES_TAB}!L${i + 1}`, [[now]]);
            break;
          }
        }
      } catch (err) {
        console.warn('[EmployeesRepository] Failed to update login timestamp in sheet:', err);
      }
    }

    await AuditService.log({
      adminEmail: emp.username,
      userName: emp.name,
      userRole: 'employee',
      action: 'LOGIN',
      target: `تسجيل دخول موظف: ${emp.name} (${emp.title || 'موظف'})`,
      afterData: JSON.stringify({ ip: ipAddress, time: now }),
      ipAddress,
    });
  }
}


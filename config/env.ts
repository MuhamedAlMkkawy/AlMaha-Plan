import { z } from 'zod';

export const EnvSchema = z.object({
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email().optional().or(z.literal('')),
  GOOGLE_PRIVATE_KEY: z.string().optional().or(z.literal('')),
  SHEET_ID: z.string().default('1ssX3tDc_2g1VBhckLHyewPhk2aQB0sQlTxHuKdwT75A'),
  SHEET_TAB_FINAL: z.string().default('Final'),
  ADMIN_EMAILS: z.string().default('admin@example.com'),
  AUTH_SECRET: z.string().default('maha-plan-secret-key-change-in-production'),
  REVALIDATE_SECRET: z.string().default('maha-revalidate-secret'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export function validateEnv(env: Record<string, any> = process.env): EnvConfig {
  const result = EnvSchema.safeParse(env);
  if (!result.success) {
    console.warn('[Env] Environment validation warnings:', result.error.format());
    return EnvSchema.parse({});
  }
  return result.data;
}


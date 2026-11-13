import { defineEventHandler } from 'h3';
import { getLiveAuthSession } from '../../utils/auth';
import { effectivePermissions } from '../../../shared/access';

export default defineEventHandler(async (event) => {
  const session = await getLiveAuthSession(event);
  return {
    authenticated: !!session,
    user: session,
    isAdmin: session?.role === 'admin',
    isEmployee: session?.role === 'employee',
    permissions: effectivePermissions(session),
  };
});

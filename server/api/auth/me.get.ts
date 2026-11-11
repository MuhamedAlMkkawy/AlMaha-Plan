import { defineEventHandler } from 'h3';
import { getAdminSession } from '../../utils/auth';

export default defineEventHandler((event) => {
  const session = getAdminSession(event);
  return {
    authenticated: !!session,
    user: session,
  };
});


'use client';

import { useSession } from 'next-auth/react';
import { can } from '@/lib/permissions';

type UserRole = 'admin' | 'writer' | 'reader';

export function useAuth() {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;
  const role = user?.role as UserRole;

  const checkPermission = (action: 'create' | 'edit' | 'delete' | 'publish' | 'comment', 
                         resource: 'article' | 'comment') => {
    if (!isAuthenticated || !role) return false;
    return can(role, action, resource);
  };

  const isAdmin = role === 'admin';
  const isWriter = role === 'writer';
  const isReader = role === 'reader';

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    checkPermission,
    isAdmin,
    isWriter,
    isReader,
  };
}

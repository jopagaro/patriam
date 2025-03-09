import { UserRole } from '@prisma/client';

type Action = 'create' | 'edit' | 'delete' | 'publish' | 'comment';
type Resource = 'article' | 'comment';

const permissions = {
  admin: {
    article: ['create', 'edit', 'delete', 'publish', 'comment'],
    comment: ['create', 'edit', 'delete'],
  },
  writer: {
    article: ['create', 'edit', 'comment'],
    comment: ['create', 'edit', 'delete'],
  },
  reader: {
    article: ['comment'],
    comment: ['create', 'edit', 'delete'],
  },
} as const;

export function can(role: UserRole, action: Action, resource: Resource): boolean {
  return permissions[role]?.[resource]?.includes(action) ?? false;
}

export function canManageArticle(role: UserRole, authorId: string, userId: string): boolean {
  if (role === 'admin') return true;
  if (role === 'writer' && authorId === userId) return true;
  return false;
}

export function canPublishArticle(role: UserRole): boolean {
  return role === 'admin';
}

export function canManageComment(role: UserRole, commentAuthorId: string, userId: string): boolean {
  if (role === 'admin') return true;
  return commentAuthorId === userId;
}

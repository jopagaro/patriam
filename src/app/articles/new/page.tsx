'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';

export default function NewArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Only admin and writers can create articles
  if (!session?.user || !['admin', 'writer'].includes(session.user.role)) {
    router.push('/unauthorized');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      <ArticleEditor />
    </div>
  );
}

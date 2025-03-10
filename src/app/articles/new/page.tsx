import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import ArticleEditor from '@/components/ArticleEditor';

export default async function NewArticlePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Only writers and admins can create articles
  if (!['writer', 'admin'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif text-light-900 mb-8">Write New Article</h1>
        <ArticleEditor />
      </div>
    </div>
  );
}

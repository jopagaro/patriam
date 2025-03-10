import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import ArticleForm from '@/components/ArticleForm';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-8">Write New Article</h1>
      <ArticleForm />
    </div>
  );
}

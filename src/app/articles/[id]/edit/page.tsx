import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  // Check authentication
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const article = await prisma.article.findUnique({
    where: { id: parseInt(params.id) },
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
      authorId: true,
    },
  });

  if (!article) {
    notFound();
  }

  // Check permissions
  if (session.user.role !== 'admin' && article.authorId !== parseInt(session.user.id)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif text-light-900 mb-8">Edit Article</h1>
        <ArticleEditor initialData={article} />
      </div>
    </div>
  );
}

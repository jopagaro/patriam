import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';

async function getArticle(id: string, userId: string | null, role: string | null) {
  const articleId = parseInt(id);
  if (isNaN(articleId)) return null;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
      authorId: true,
    },
  });

  if (!article) return null;

  // Check permissions
  if (!role) return null; // Not authenticated
  if (role !== 'admin' && article.authorId !== parseInt(userId || '0')) return null;

  return article;
}

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  // Check authentication
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const article = await getArticle(
    params.id,
    session.user.id,
    session.user.role
  );

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      <ArticleEditor initialData={article} />
    </div>
  );
}

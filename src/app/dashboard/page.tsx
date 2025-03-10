import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const userArticles = await prisma.article.findMany({
    where: {
      authorId: parseInt(session.user.id),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100">My Dashboard</h1>
        <Link
          href="/articles/new"
          className="btn-primary px-4 py-2"
        >
          Write New Article
        </Link>
      </div>

      <div className="space-y-6">
        <div className="bg-dark-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">My Articles</h2>
          {userArticles.length === 0 ? (
            <p className="text-gray-400">You haven't written any articles yet.</p>
          ) : (
            <div className="space-y-4">
              {userArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 bg-dark-700 rounded-lg"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-100">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {article.status} • {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/articles/${article.id}/edit`}
                      className="btn-secondary px-3 py-1 text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/articles/${article.id}`}
                      className="btn-secondary px-3 py-1 text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import SignOutButton from '@/components/SignOutButton';

interface Article {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const userArticles = await prisma.article.findMany({
    where: {
      authorId: parseInt(session.user.id.toString()),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-light-900 mb-2">Dashboard</h1>
            <p className="text-light-400">Welcome back, {session.user.username}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/articles/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Write New Article
            </Link>
            <SignOutButton />
          </div>
        </div>

        {/* Articles Section */}
        <div className="space-y-6">
          <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-light-900 mb-6">My Articles</h2>
            {userArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-light-400 mb-6">You haven't written any articles yet.</p>
                <Link
                  href="/articles/new"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Start Writing
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {userArticles.map((article: Article) => (
                  <div
                    key={article.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-medium text-light-900 mb-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-light-400">
                        <span className="inline-block px-2 py-1 bg-dark-600 rounded-full text-xs mr-2">
                          {article.status}
                        </span>
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/articles/${article.id}/edit`}
                        className="px-4 py-2 bg-dark-600 text-light-900 rounded-lg hover:bg-dark-500 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/articles/${article.id}`}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
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
    </div>
  );
} 
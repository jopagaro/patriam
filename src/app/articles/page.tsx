import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/types/article';

interface ArticleWithRelations extends Article {
  author: {
    username: string;
    role: string;
  };
  _count: {
    comments: number;
  };
}

async function getArticles(userId: string | null, role: string | null): Promise<ArticleWithRelations[]> {
  // Build query conditions based on user role
  const where: any = {};
  
  if (!role || role === 'reader') {
    where.status = 'published';
  } else if (role === 'writer') {
    where.OR = [
      { status: 'published' },
      { AND: [{ status: 'draft' }, { authorId: parseInt(userId || '0') }] }
    ];
  }
  // Admin can see all articles

  const articles = await prisma.article.findMany({
    where,
    include: {
      author: {
        select: {
          username: true,
          role: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return articles as ArticleWithRelations[];
}

export default async function ArticlesPage() {
  const session = await getServerSession(authOptions);
  const articles = await getArticles(
    session?.user?.id || null,
    session?.user?.role || null
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        {session?.user && ['admin', 'writer'].includes(session.user.role) && (
          <Link
            href="/articles/new"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Article
          </Link>
        )}
      </div>

      <div className="grid gap-6">
        {articles.map((article: ArticleWithRelations) => (
          <article
            key={article.id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-gray-900 hover:text-primary-600"
                  >
                    {article.title}
                  </Link>
                </h2>
                <div className="text-sm text-gray-600">
                  By {article.author.username} ({article.author.role})
                  {' • '}
                  {new Date(article.createdAt).toLocaleDateString()}
                  {' • '}
                  {article._count.comments} comments
                </div>
              </div>
              {article.status === 'draft' && (
                <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
            </div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>
                {article.content.length > 200
                  ? `${article.content.slice(0, 200)}...`
                  : article.content}
              </ReactMarkdown>
            </div>
            <div className="mt-4">
              <Link
                href={`/articles/${article.id}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

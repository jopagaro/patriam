import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/types/article';
import { motion } from 'framer-motion';

interface ArticleWithRelations extends Article {
  author: {
    username: string;
    role: string;
  };
  _count: {
    comments: number;
  };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

async function getArticles(userId: string | null, role: string | null): Promise<ArticleWithRelations[]> {
  const where: any = {};
  
  if (!role || role === 'reader') {
    where.status = 'published';
  } else if (role === 'writer') {
    where.OR = [
      { status: 'published' },
      { AND: [{ status: 'draft' }, { authorId: parseInt(userId || '0') }] }
    ];
  }

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
    <div className="min-h-screen bg-dark-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Articles</h1>
            <p className="text-gray-400">Latest news and updates from Patriam</p>
          </div>
          {session?.user && ['admin', 'writer'].includes(session.user.role) && (
            <Link
              href="/articles/new"
              className="btn-primary inline-flex items-center"
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
              Create Article
            </Link>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles.map((article: ArticleWithRelations) => (
            <motion.article
              key={article.id}
              variants={item}
              className="article-card group"
            >
              <Link href={`/articles/${article.id}`} className="block">
                <h2 className="article-title group-hover:text-primary-400">
                  {article.title}
                </h2>
                <div className="article-meta">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {article.author.username}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    {article._count.comments}
                  </span>
                  {article.status === 'draft' && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-500 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                <div className="article-content">
                  <div className="line-clamp-3">
                    {article.content.slice(0, 200)}...
                  </div>
                </div>
                <div className="mt-4 flex items-center text-primary-400 font-medium group-hover:text-primary-300">
                  Read more
                  <svg
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

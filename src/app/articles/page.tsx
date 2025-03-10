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
  const articles = await prisma.article.findMany({
    where: {
      status: 'published',
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-dark-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  href={`/articles/${article.id}`}
                  className="text-gray-100 hover:text-primary-400"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                By {article.author.username} •{' '}
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-300 line-clamp-3">
                {article.content.substring(0, 150)}...
              </p>
              <div className="mt-4">
                <Link
                  href={`/articles/${article.id}`}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

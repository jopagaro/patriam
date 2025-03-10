'use client';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import DeleteArticleButton from '@/components/DeleteArticleButton';
import CommentForm from '@/components/CommentForm';
import { motion } from 'framer-motion';

interface ArticleWithRelations {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt: Date;
  authorId: number;
  author: {
    username: string;
    role: string;
  };
  comments: {
    id: number;
    text: string;
    createdAt: Date;
    user: {
      username: string;
    };
  }[];
}

async function getArticle(id: string): Promise<ArticleWithRelations | null> {
  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: {
        select: {
          username: true,
          role: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return article as ArticleWithRelations;
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const article = await prisma.article.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!article || (article.status !== 'published' && article.author.id !== parseInt(session?.user?.id || '0'))) {
    notFound();
  }

  const isAuthor = session?.user?.id === article.author.id.toString();
  const isAdmin = session?.user?.role === 'admin';
  const canEdit = isAuthor || isAdmin;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/articles"
            className="text-gray-400 hover:text-gray-300 flex items-center"
          >
            ← Back to Articles
          </Link>
          {canEdit && (
            <div className="flex space-x-4">
              <Link
                href={`/articles/${article.id}/edit`}
                className="btn-secondary px-4 py-2"
              >
                Edit
              </Link>
              <DeleteArticleButton articleId={article.id} />
            </div>
          )}
        </div>

        <article className="bg-dark-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="text-gray-400 mb-8">
            By {article.author.username} •{' '}
            {new Date(article.createdAt).toLocaleDateString()}
            {article.status === 'draft' && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-500 rounded-full">
                Draft
              </span>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}

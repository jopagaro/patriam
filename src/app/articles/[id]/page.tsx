'use client';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import DeleteArticleButton from './DeleteArticleButton';
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
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  const canEdit =
    session?.user &&
    (session.user.role === 'admin' ||
      (session.user.role === 'writer' && article.authorId === parseInt(session.user.id)));

  const canDelete = session?.user?.role === 'admin';

  return (
    <div className="min-h-screen bg-dark-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-dark-400/50 backdrop-blur-sm rounded-lg p-8 shadow-xl"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{article.author.username}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {article.status === 'draft' && (
                  <span className="px-3 py-1 text-sm font-semibold bg-yellow-500/10 text-yellow-500 rounded-full">
                    Draft
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-4">
              {canEdit && (
                <Link
                  href={`/articles/${article.id}/edit`}
                  className="btn-secondary inline-flex items-center"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </Link>
              )}
              {canDelete && <DeleteArticleButton articleId={article.id} />}
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          <div className="border-t border-dark-300 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>
            {session?.user ? (
              <div className="mb-8">
                <CommentForm articleId={article.id} />
              </div>
            ) : (
              <p className="text-gray-400 mb-8">
                Please{' '}
                <Link href="/auth/signin" className="text-primary-400 hover:text-primary-300">
                  sign in
                </Link>{' '}
                to leave a comment.
              </p>
            )}

            <div className="space-y-6">
              {article.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-dark-300/50 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-400">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{comment.user.username}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300">{comment.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

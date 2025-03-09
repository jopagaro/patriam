'use client';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import DeleteArticleButton from './DeleteArticleButton';
import CommentForm from '@/components/CommentForm';
import { Article, Comment } from '@/types/article';

interface ArticleWithRelations extends Article {
  author: {
    id: number;
    username: string;
    role: string;
  };
  comments: Array<Comment & {
    user: {
      id: number;
      username: string;
      role: string;
    };
  }>;
}

async function getArticle(id: string, userId: string | null, role: string | null): Promise<ArticleWithRelations | null> {
  const articleId = parseInt(id);
  if (isNaN(articleId)) return null;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!article) return null;

  // Check permissions
  if (article.status === 'draft') {
    if (!role) return null; // Not authenticated
    if (role === 'reader') return null; // Readers can't see drafts
    if (role === 'writer' && article.authorId !== parseInt(userId || '0')) return null; // Writers can only see their own drafts
  }

  return article as ArticleWithRelations;
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const session = getServerSession(authOptions);
  const article = getArticle(
    params.id,
    session?.user?.id || null,
    session?.user?.role || null
  );

  if (!article) {
    notFound();
  }

  const isAuthor = session?.user?.id && parseInt(session.user.id) === article.authorId;
  const isAdmin = session?.user?.role === 'admin';
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAdmin;

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/articles/${article.id}/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      router.refresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          {article.status === 'draft' && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              Draft
            </span>
          )}
        </div>
        
        <div className="text-gray-600 mb-4">
          By {article.author.username} ({article.author.role})
          {' • '}
          {new Date(article.createdAt).toLocaleDateString()}
        </div>

        {canEdit && (
          <div className="flex space-x-4 mb-6">
            <Link
              href={`/articles/${article.id}/edit`}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Edit Article
            </Link>
            {canDelete && (
              <DeleteArticleButton id={article.id} />
            )}
          </div>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        {session?.user && article.status === 'published' ? (
          <div className="mb-8">
            <CommentForm articleId={article.id} />
          </div>
        ) : article.status === 'draft' ? (
          <p className="text-gray-600">
            Comments are disabled for draft articles.
          </p>
        ) : (
          <p className="text-gray-600">
            Please <Link href="/auth/signin" className="text-primary-600 hover:underline">sign in</Link> to comment.
          </p>
        )}

        <div className="space-y-6">
          {article.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{comment.user.username}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {(session?.user?.id && parseInt(session.user.id) === comment.user.id || session?.user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-2 text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

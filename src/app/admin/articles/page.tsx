'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  author: {
    username: string;
    role: string;
  };
}

export default function AdminArticlesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (session?.user.role !== 'ADMIN') {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles/list');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (articleId: number, newStatus: 'draft' | 'published') => {
    try {
      const article = articles.find(a => a.id === articleId);
      if (!article) return;

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          status: newStatus
        }),
      });

      if (!response.ok) throw new Error('Failed to update article status');
      fetchArticles(); // Refresh the list
    } catch (err) {
      console.error(err);
      setError('Failed to update article status');
    }
  };

  const handleDelete = async (articleId: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch('/api/articles/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: articleId }),
      });

      if (!response.ok) throw new Error('Failed to delete article');
      fetchArticles(); // Refresh the list
    } catch (err) {
      console.error(err);
      setError('Failed to delete article');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Article Management</h1>
        <Link 
          href="/articles/new" 
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Create New Article
        </Link>
      </div>

      <div className="bg-dark-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-dark-800 divide-y divide-gray-700">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-dark-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/articles/${article.id}`} className="text-primary-400 hover:text-primary-300">
                    {article.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {article.author.username}
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-dark-600">
                    {article.author.role.toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={article.status}
                    onChange={(e) => handleStatusChange(article.id, e.target.value as 'draft' | 'published')}
                    className="bg-dark-600 text-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/articles/${article.id}/edit`}
                    className="text-primary-400 hover:text-primary-300 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
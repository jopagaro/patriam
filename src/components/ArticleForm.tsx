'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function ArticleForm({ article }: { article?: { id: number; title: string; content: string; status: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [status, setStatus] = useState(article?.status || 'draft');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(article ? `/api/articles/${article.id}` : '/api/articles', {
        method: article ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save article');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Article save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-200">
          Title
        </label>
        <div className="mt-1">
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field w-full"
            placeholder="Enter article title"
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
          Content
        </label>
        <MDEditor
          value={content}
          onChange={(value) => setContent(value || '')}
          preview="edit"
          height={400}
          className="bg-dark-800"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-200">
          Status
        </label>
        <div className="mt-1">
          <select
            id="status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field w-full"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary px-4 py-2"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary px-4 py-2"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : article ? 'Update Article' : 'Create Article'}
        </button>
      </div>
    </form>
  );
} 
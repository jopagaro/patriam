'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Import MD Editor dynamically to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface ArticleEditorProps {
  initialData?: {
    id?: number;
    title?: string;
    content?: string;
    status?: 'draft' | 'published';
  };
}

export default function ArticleEditor({ initialData }: ArticleEditorProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!initialData?.id;
  const isAdmin = session?.user?.role === 'admin';

  const handleSubmit = async () => {
    if (!session?.user) {
      setError('You must be logged in to create articles');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const endpoint = isEditing
        ? '/api/articles/update'
        : '/api/articles/create';
      
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing
        ? { id: initialData.id, title, content }
        : { title, content };

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save article');
      }

      router.push('/articles');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Article title"
          />
        </div>

        <div data-color-mode="light">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <MDEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            preview="edit"
            height={400}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
          {isAdmin && initialData?.status === 'draft' && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await fetch('/api/articles/update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: initialData.id,
                      status: 'published'
                    }),
                  });
                  router.refresh();
                } catch (err) {
                  setError('Failed to publish article');
                }
              }}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Publish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

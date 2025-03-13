'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface ArticleEditorProps {
  initialData?: {
    id: number;
    title: string;
    content: string;
    status: string;
    imageUrl?: string;
  };
}

export default function ArticleEditor({ initialData }: ArticleEditorProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isEdit = !!initialData;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setImageUrl(data.url);
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const submitData = {
        id: initialData?.id,
        title: title.trim(),
        content: content.trim(),
        imageUrl,
        status,
      };

      const endpoint = isEdit 
        ? `/api/articles/${initialData.id}` 
        : '/api/articles';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save article');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Article submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        {/* Title Input */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title"
            className="w-full px-4 py-3 text-2xl font-serif bg-dark-700/50 border border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            disabled={isSubmitting}
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-light-300 mb-2">
            Article Thumbnail
          </label>
          <div className="flex items-start space-x-4">
            <div className="relative w-48 h-32 bg-dark-700/50 rounded-lg overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Article thumbnail"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-light-300/20">
                  No image
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-dark-900/50 flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="block w-full text-sm text-light-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-dark-700 file:text-light-300
                hover:file:bg-dark-600
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-light-400">
                Recommended: 1200×800px or larger
              </p>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="mb-6">
          <MDEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            preview="edit"
            height={500}
            className="!bg-dark-700/50"
            textareaProps={{
              placeholder: 'Write your article content here...',
            }}
          />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-light-300 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-light-300 rounded-lg transition-colors inline-flex items-center"
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
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Save as Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors inline-flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Publish
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

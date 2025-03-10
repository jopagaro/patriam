'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteArticleButton({ articleId }: { articleId: number }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete article');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="btn-danger px-4 py-2"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
} 
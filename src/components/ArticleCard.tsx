'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    content: string;
    imageUrl?: string | null;
    createdAt: Date;
    author?: {
      username: string;
    };
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Get the first paragraph of content for the preview
  const preview = article.content
    .split('\n')
    .find(line => line.trim().length > 0)
    ?.slice(0, 150) + '...';

  return (
    <Link href={`/articles/${article.id}`}>
      <article className="group h-full bg-dark-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-dark-800 transition-colors">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] bg-dark-700">
          <Image
            src={article.imageUrl || '/images/default-article-thumbnail.svg'}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Author & Date */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
              {article.author?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm text-light-900">{article.author?.username || 'Anonymous'}</p>
              <p className="text-xs text-light-400">
                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Title & Preview */}
          <h3 className="text-xl font-serif text-light-900 mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-light-400 line-clamp-2">
            {preview}
          </p>

          {/* Read More */}
          <div className="mt-4 flex items-center text-primary-500 text-sm font-medium group-hover:text-primary-400">
            Read More
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
        </div>
      </article>
    </Link>
  );
} 
'use client';

import React from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ArticleReaderProps {
  article: {
    title: string;
    content: string;
    imageUrl?: string | null;
    createdAt: Date;
    author?: {
      username: string;
    };
  };
}

export default function ArticleReader({ article }: ArticleReaderProps) {
  return (
    <article className="max-w-screen-md mx-auto px-4 py-12">
      {/* Article Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-light-900 mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center space-x-4 text-light-400">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              {article.author?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-light-900">{article.author?.username || 'Anonymous'}</p>
              <p className="text-sm">
                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.imageUrl && (
        <div className="relative aspect-[16/9] mb-12">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-invert prose-lg max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ node, ...props }) => (
              <a {...props} className="text-primary-500 hover:text-primary-400 transition-colors" />
            ),
            img: ({ node, ...props }) => (
              <Image
                {...props}
                alt={props.alt || ''}
                width={800}
                height={400}
                className="rounded-lg"
              />
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-light-900/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 text-light-400 hover:text-light-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
            <button className="p-2 text-light-400 hover:text-light-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
            </button>
          </div>
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
            Subscribe
          </button>
        </div>
      </footer>
    </article>
  );
} 
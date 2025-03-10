import Link from 'next/link';
import Image from 'next/image';

type ArticleGridProps = {
  articles: Array<{
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    author: {
      username: string;
    };
  }>;
};

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}`}
          className="group block"
        >
          {/* Article thumbnail with gradient overlay */}
          <div className="aspect-[3/2] bg-dark-800 mb-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/50 group-hover:to-dark-900/30 transition-colors z-10" />
            {/* Placeholder gradient - replace with actual image when available */}
            <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-900 transform group-hover:scale-105 transition-transform duration-500" />
            
            {/* Uncomment and use this when you have actual images */}
            {/* <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
            /> */}
          </div>

          {/* Article meta */}
          <div className="mb-3">
            <div className="flex items-center text-light-300 text-sm mb-2">
              <span className="font-medium">{article.author.username}</span>
              <span className="mx-2">·</span>
              <time dateTime={article.createdAt.toISOString()}>
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>
            <h3 className="text-h4 font-serif text-light-900 group-hover:text-light-700 transition-colors line-clamp-2">
              {article.title}
            </h3>
          </div>

          <p className="text-light-300 line-clamp-2 text-sm leading-relaxed">
            {article.content.substring(0, 150)}...
          </p>
        </Link>
      ))}
    </div>
  );
} 
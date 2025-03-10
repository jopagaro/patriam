import Link from 'next/link';
import Image from 'next/image';

type ArticleGridProps = {
  articles: Array<{
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt: Date;
    author: {
      username: string;
    };
  }>;
};

export default function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}`}
          className="group block"
        >
          {/* Article Card */}
          <article className="flex flex-col h-full bg-dark-800/30 hover:bg-dark-800/50 transition-colors">
            {/* Thumbnail */}
            <div className="relative aspect-[16/9] overflow-hidden">
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-dark-700 to-dark-900">
                  <div className="flex h-full items-center justify-center text-4xl text-light-300/10">
                    P
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-4">
              <h3 className="text-xl font-serif text-light-900 mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                {article.title}
              </h3>
              <p className="text-light-300/60 text-sm line-clamp-2 mb-4 flex-grow">
                {article.content.substring(0, 120)}...
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-light-300/40 font-medium">
                  {article.author.username}
                </span>
                <time className="text-light-300/30" dateTime={article.createdAt.toISOString()}>
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
} 
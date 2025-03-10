import Link from 'next/link';

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
          {/* Placeholder for article image - you can add real images later */}
          <div className="aspect-[3/2] bg-dark-800 mb-4 overflow-hidden">
            <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-300" />
          </div>

          <h3 className="text-h4 font-serif text-light-900 mb-2 group-hover:text-light-700 transition-colors">
            {article.title}
          </h3>

          <div className="flex items-center text-light-300 text-sm space-x-4 mb-3">
            <span>{article.author.username}</span>
            <span>•</span>
            <time dateTime={article.createdAt.toISOString()}>
              {new Date(article.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          <p className="text-light-300 line-clamp-3">
            {article.content.substring(0, 150)}...
          </p>
        </Link>
      ))}
    </div>
  );
} 
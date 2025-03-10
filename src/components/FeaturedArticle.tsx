import Link from 'next/link';

type FeaturedArticleProps = {
  article: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    author: {
      username: string;
    };
  };
};

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="block group relative overflow-hidden"
    >
      {/* Placeholder for article image - you can add real images later */}
      <div className="aspect-[2/1] bg-dark-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-h2 md:text-h1 font-serif text-light-900 mb-4 group-hover:text-light-700 transition-colors">
            {article.title}
          </h1>
          <div className="flex items-center text-light-300 space-x-4">
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
        </div>
      </div>
    </Link>
  );
} 
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
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}`}
          className="group block overflow-hidden rounded-lg bg-dark-800/50 transition-all hover:bg-dark-800"
        >
          <div className="relative aspect-[16/9] overflow-hidden">
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-dark-700/80 to-dark-900 group-hover:from-dark-700 group-hover:to-dark-800">
                <div className="flex h-full items-center justify-center text-4xl text-light-300/20">
                  P
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="mb-2 font-serif text-xl font-medium text-light-900 group-hover:text-primary-400">
              {article.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-light-300">
              {article.content.substring(0, 150)}
            </p>
            <div className="flex items-center justify-between text-sm text-light-400">
              <span>{article.author.username}</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 
import Image from 'next/image';
import Link from 'next/link';

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    content: string;
    imageUrl?: string | null;
    status: string;
    createdAt: Date;
    author?: {
      username: string;
    };
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const defaultThumbnail = '/images/default-article-thumbnail.jpg';

  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl transition-transform hover:scale-[1.02]">
      <Link href={`/articles/${article.id}`}>
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={article.imageUrl || defaultThumbnail}
            alt={article.title}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultThumbnail;
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-serif text-light-900 mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-light-400 line-clamp-2">
            {article.content.substring(0, 150)}...
          </p>
          <div className="mt-4 flex items-center justify-between text-sm text-light-500">
            <span>{article.author?.username || 'Anonymous'}</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </div>
  );
} 
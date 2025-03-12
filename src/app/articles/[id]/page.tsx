import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import ArticleReader from '@/components/ArticleReader';
import { Metadata } from 'next';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      author: {
        select: {
          username: true
        }
      }
    }
  });

  if (!article) {
    return {
      title: 'Article Not Found - Patriam',
      description: 'The requested article could not be found.'
    };
  }

  return {
    title: `${article.title} - Patriam`,
    description: article.content.substring(0, 155) + '...',
    openGraph: article.imageUrl ? {
      images: [article.imageUrl]
    } : undefined
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      author: {
        select: {
          username: true
        }
      }
    }
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-20">
      <ArticleReader article={article} />
    </div>
  );
}

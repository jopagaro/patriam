import Link from 'next/link';
import { prisma } from '@/lib/db';
import FeaturedArticle from '@/components/FeaturedArticle';
import ArticleGrid from '@/components/ArticleGrid';

export default async function HomePage() {
  const featuredArticles = await prisma.article.findMany({
    where: {
      status: 'published',
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  const [mainFeature, ...gridArticles] = featuredArticles;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header Spacing for fixed navbar */}
      <div className="h-16" />

      {/* Main Feature */}
      {mainFeature && (
        <section className="container mx-auto px-4 py-12">
          <FeaturedArticle article={mainFeature} />
        </section>
      )}

      {/* Article Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-h3 font-serif text-light-900">Latest Articles</h2>
          <div className="h-px bg-dark-700 mt-4" />
        </div>
        <ArticleGrid articles={gridArticles} />
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16 border-t border-dark-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-h3 font-serif text-light-900 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-light-300 mb-8">
            Get the latest articles and insights delivered straight to your inbox.
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 text-light-900 placeholder-light-300 focus:outline-none focus:border-light-300"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-light-900 text-dark-900 hover:bg-light-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
} 
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import ArticleGrid from '@/components/ArticleGrid';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const articles = await prisma.article.findMany({
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
    take: 9,
  });

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header Spacing for fixed navbar */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="relative bg-dark-900 border-b border-light-900/10">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl">
            <h1 className="text-h2 md:text-display font-serif text-light-900 mb-6">
              Shape the Future 
              <br />
              You Desire
            </h1>
            <p className="text-h4 md:text-h3 text-light-300 mb-12 max-w-2xl">
              Join a community of writers and thinkers who are building tomorrow's narratives today.
            </p>
            <Link
              href={session ? "/articles/new" : "/auth/signin"}
              className="group inline-flex items-center"
            >
              <span className="text-light-900 text-lg font-medium mr-4">
                Start Writing
              </span>
              <span className="h-12 w-12 rounded-full bg-light-900 text-dark-900 flex items-center justify-center transform transition-transform group-hover:translate-x-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="bg-dark-900">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-h3 font-serif text-light-900">Featured Articles</h2>
            <Link 
              href="/articles" 
              className="text-light-300/60 hover:text-light-900 transition-colors"
            >
              View All →
            </Link>
          </div>
          <ArticleGrid articles={articles} />
        </div>
      </section>

      {/* Quote Footer */}
      <div className="container mx-auto px-4 pb-8">
        <p className="text-xs text-light-300/40 text-center italic">
          "The future is not something we enter, it is something we create." — Cicero (maybe lol)
        </p>
      </div>
    </div>
  );
} 
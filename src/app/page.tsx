import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import ArticleCard from '@/components/ArticleCard';
import Navbar from '@/components/Navbar';

type ArticleWithAuthor = {
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

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  let articles: ArticleWithAuthor[] = [];
  
  try {
    articles = await prisma.article.findMany({
      where: {
        status: 'published'
      },
      include: {
        author: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-light-900 mb-6 leading-tight">
              Shape the Future 
              <span className="block mt-2 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                You Desire
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-light-300 mb-12 max-w-2xl mx-auto">
              Join a community of writers and thinkers who are building tomorrow's narratives today.
            </p>
            <Link
              href={session ? "/articles/new" : "/auth/signin"}
              className="group inline-flex items-center bg-light-900 text-dark-900 px-8 py-4 rounded-full hover:bg-light-800 transition-all transform hover:scale-105"
            >
              <span className="text-lg font-medium mr-4">
                Start Writing
              </span>
              <span className="group-hover:translate-x-2 transition-transform">
                →
              </span>
            </Link>
          </div>

          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="relative py-24 bg-dark-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-baseline mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-light-900 mb-2">Featured Articles</h2>
              <p className="text-light-400">Discover thought-provoking perspectives</p>
            </div>
            <Link 
              href="/articles" 
              className="group flex items-center text-light-300/60 hover:text-light-900 transition-colors"
            >
              View All 
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: ArticleWithAuthor) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-light-400">Be the first to share your thoughts.</p>
              <Link
                href="/articles/new"
                className="inline-block mt-6 px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
              >
                Write an Article
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quote Footer */}
      <footer className="bg-dark-900/30 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <p className="text-sm text-light-300/40 text-center italic max-w-2xl mx-auto">
            "The future is not something we enter, it is something we create." — Cicero (maybe lol)
          </p>
        </div>
      </footer>
    </div>
  );
} 
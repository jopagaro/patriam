import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Patriam',
  description: 'Learn more about our mission and vision',
};

export default async function AboutPage() {
  const session = await getServerSession(authOptions);
  const aboutContent = await prisma.page.findFirst({
    where: { slug: 'about' }
  });

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-serif text-light-900">About Patriam</h1>
            {isAdmin && (
              <Link
                href="/admin/pages/about/edit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
              >
                Edit Page
              </Link>
            )}
          </div>

          <div className="prose prose-invert max-w-none">
            {aboutContent ? (
              <div dangerouslySetInnerHTML={{ __html: aboutContent.content }} />
            ) : (
              <div className="text-light-400">
                <p className="text-xl mb-6">
                  Welcome to Patriam, a platform dedicated to thoughtful discourse and meaningful narratives.
                </p>
                {isAdmin && (
                  <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg p-6 mt-8">
                    <p className="text-light-300 mb-4">
                      This is the default about page content. As an admin, you can customize this page by clicking the Edit button above.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
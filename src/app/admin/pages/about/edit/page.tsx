import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { prisma } from '@/lib/db';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default async function EditAboutPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  const aboutPage = await prisma.page.findFirst({
    where: { slug: 'about' }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif text-light-900 mb-8">Edit About Page</h1>
          
          <Editor
            initialContent={aboutPage?.content || ''}
            onSave={async (content: string) => {
              'use server';
              await prisma.page.upsert({
                where: { slug: 'about' },
                update: { content },
                create: {
                  slug: 'about',
                  title: 'About Patriam',
                  content
                }
              });
              redirect('/about');
            }}
          />
        </div>
      </div>
    </div>
  );
} 
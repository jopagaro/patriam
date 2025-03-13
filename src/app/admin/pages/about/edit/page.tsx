import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AboutPageEditor from './AboutPageEditor';

export default async function EditAboutPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Get existing about page content
  const aboutPage = await prisma.page.findUnique({
    where: { slug: 'about' }
  });

  return <AboutPageEditor initialContent={aboutPage?.content} />;
} 
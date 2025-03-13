import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const page = await prisma.page.upsert({
      where: { slug: 'about' },
      update: { content: content.trim() },
      create: {
        slug: 'about',
        title: 'About Patriam',
        content: content.trim()
      }
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Save about page error:', error);
    return NextResponse.json(
      { error: 'Failed to save page' },
      { status: 500 }
    );
  }
} 
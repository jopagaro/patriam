import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { CreateArticleInput } from '@/types/article';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has permission
    if (!session?.user || !['admin', 'writer'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Only admins and writers can create articles' },
        { status: 403 }
      );
    }

    const { title, content } = await req.json() as CreateArticleInput;

    // Validate input
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Set initial status based on role
    const status = session.user.role === 'admin' ? 'published' : 'draft';

    const article = await prisma.article.create({
      data: {
        title,
        content,
        status,
        authorId: parseInt(session.user.id),
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

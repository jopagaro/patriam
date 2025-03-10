import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/articles - Fetch published articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const authorId = searchParams.get('authorId');

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (authorId) {
      where.authorId = parseInt(authorId);
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching articles' },
      { status: 500 }
    );
  }
}

// POST /api/articles - Create a new article
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only writers and admins can create articles
    if (!['writer', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, content, status } = await request.json();

    // Basic validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create article
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
    console.error('Article creation error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the article' },
      { status: 500 }
    );
  }
}

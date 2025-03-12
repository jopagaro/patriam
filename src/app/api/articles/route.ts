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
    console.log('Session in API:', session); // Debug session

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database to ensure they exist and have correct role
    const user = await prisma.user.findUnique({
      where: { username: session.user.username },
      select: { id: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only writers and admins can create articles
    const userRole = user.role.toUpperCase();
    if (!['WRITER', 'ADMIN'].includes(userRole)) {
      return NextResponse.json({ 
        error: `Forbidden - Role ${userRole} not allowed. Must be WRITER or ADMIN.` 
      }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, status, imageUrl } = body;

    // Basic validation
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be either "draft" or "published"' },
        { status: 400 }
      );
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        status: status || 'draft',
        imageUrl: imageUrl || null,
        authorId: user.id // Use the ID from the database query
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
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

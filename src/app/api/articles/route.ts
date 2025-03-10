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

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only writers and admins can create articles
    const userRole = session.user.role?.toUpperCase();
    console.log('User role:', userRole); // Debug role
    console.log('User ID:', session.user.id); // Debug user ID

    if (!['WRITER', 'ADMIN'].includes(userRole)) {
      return NextResponse.json({ 
        error: `Forbidden - Role ${userRole} not allowed. Must be WRITER or ADMIN.` 
      }, { status: 403 });
    }

    const body = await request.json();
    console.log('Raw request body:', body); // Debug raw body

    const { title, content, status, imageUrl } = body;
    console.log('Parsed request data:', { title, content, status, imageUrl });

    // Basic validation
    if (!title || !content) {
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

    // Validate and convert user ID
    let authorId: number;
    try {
      const rawId = session.user.id;
      console.log('Raw user ID:', rawId, 'Type:', typeof rawId);

      // Handle different ID types
      if (typeof rawId === 'number') {
        authorId = rawId;
      } else if (typeof rawId === 'string') {
        authorId = parseInt(rawId, 10);
      } else {
        console.error('Unexpected ID type:', typeof rawId);
        throw new Error('Invalid user ID type');
      }

      if (isNaN(authorId) || authorId <= 0) {
        console.error('Invalid user ID value:', rawId);
        throw new Error('Invalid user ID value');
      }

      // Verify the user exists
      const user = await prisma.user.findUnique({
        where: { id: authorId },
        select: { id: true, role: true },
      });

      if (!user) {
        console.error('User not found for ID:', authorId);
        throw new Error('User not found');
      }

      // Double check user role
      if (!['ADMIN', 'WRITER'].includes(user.role)) {
        console.error('User role not allowed:', user.role);
        throw new Error('User role not allowed');
      }

      console.log('Validated user ID:', authorId, 'Role:', user.role);
    } catch (error) {
      console.error('User validation error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'User validation failed' },
        { status: 400 }
      );
    }

    // Create article
    const articleData = {
      title: title.trim(),
      content: content.trim(),
      status: status || 'draft',
      imageUrl: imageUrl || null,
      authorId,
    };
    console.log('Article data to create:', articleData);

    const article = await prisma.article.create({
      data: articleData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    console.log('Created article:', article);
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Article creation error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: 'An error occurred while creating the article' },
      { status: 500 }
    );
  }
}

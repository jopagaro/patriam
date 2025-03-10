import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/articles/:id - Get a single article with comments
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(params.id),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PATCH /api/articles/:id - Update an article
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const isAuthor = article.authorId === parseInt(session.user.id);
    const isAdmin = session.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, content, status } = await request.json();

    const updatedArticle = await prisma.article.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        title,
        content,
        status,
      },
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Article update error:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const isAuthor = article.authorId === parseInt(session.user.id);
    const isAdmin = session.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.article.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Article deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}

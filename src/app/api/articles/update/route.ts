import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, title, content, imageUrl, status } = await req.json();

    // Validate article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isAuthor = existingArticle.authorId === parseInt(session.user.id);
    const isAdmin = session.user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'You can only edit your own articles unless you are an admin' },
        { status: 403 }
      );
    }

    // Only admin can change status of other people's articles
    if (status && !isAdmin && !isAuthor) {
      return NextResponse.json(
        { error: 'Only admins can change article status' },
        { status: 403 }
      );
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl,
        ...(status && { status }),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

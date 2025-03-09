import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { UpdateArticleInput } from '@/types/article';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, title, content, status } = await req.json() as UpdateArticleInput;

    // Validate article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isAuthor = existingArticle.authorId === parseInt(session.user.id);
    const isAdmin = session.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Only the author or admin can update this article' },
        { status: 403 }
      );
    }

    // Only admin can change status
    if (status && !isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can change article status' },
        { status: 403 }
      );
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
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

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    // Build query conditions
    const where: any = {};

    // If not admin, only show published articles unless viewing own drafts
    if (!session?.user || session.user.role !== 'admin') {
      if (status === 'draft') {
        if (!session?.user) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
        // Writers can see their own drafts
        where.AND = [
          { status: 'draft' },
          { authorId: parseInt(session.user.id) }
        ];
      } else {
        where.status = 'published';
      }
    } else if (status) {
      // Admin can filter by any status
      where.status = status;
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

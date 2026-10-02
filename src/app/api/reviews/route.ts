import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all reviews (Public/Admin)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const approvedOnly = searchParams.get('approvedOnly') === 'true';

    const whereClause = approvedOnly ? { isApproved: true } : {};

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (err: any) {
    console.error('Reviews GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new review (Clients only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    const clientId = (session.user as any).id;

    const newReview = await prisma.review.create({
      data: {
        rating,
        comment,
        clientId,
        isApproved: false, // Requires admin approval
      },
    });

    return NextResponse.json(newReview);
  } catch (err: any) {
    console.error('Review POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'CLIENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = (session.user as any).id;

    const clientProfile = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        orders: {
          include: {
            garments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        communications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!clientProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(clientProfile);
  } catch (err: any) {
    console.error('Portal profile GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

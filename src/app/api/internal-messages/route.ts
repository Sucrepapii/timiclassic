import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const peerId = searchParams.get('peerId');
    const myId = (session.user as any).id;

    if (!peerId) {
      // Just return a list of users we can chat with
      const users = await prisma.user.findMany({
        where: { id: { not: myId } },
        select: { id: true, name: true, email: true, role: true }
      });
      return NextResponse.json({ peers: users });
    }

    // Fetch messages between myId and peerId
    const messages = await prisma.internalMessage.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: peerId },
          { senderId: peerId, receiverId: myId }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const myId = (session.user as any).id;
    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const message = await prisma.internalMessage.create({
      data: {
        content,
        senderId: myId,
        receiverId
      },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });

    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

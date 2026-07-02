import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { id: params.id },
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

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      notes,
      measurements,
      portalPassword,
    } = body;

    const role = (session.user as any).role;
    const userId = (session.user as any).id;
    
    if (role === 'CLIENT' && params.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const existingClient = await prisma.client.findUnique({
      where: { id: params.id },
    });

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const emailKey = email?.toLowerCase().trim() || null;
    
    // Check email uniqueness if modified
    if (emailKey && emailKey !== existingClient.email) {
      const duplicateEmail = await prisma.client.findUnique({
        where: { email: emailKey },
      });
      if (duplicateEmail) {
        return NextResponse.json({ error: 'Email already taken by another client' }, { status: 400 });
      }
    }

    const updateData: any = {
      firstName,
      lastName,
      email: emailKey,
      phone,
      address,
      notes,
      measurements,
    };

    if (portalPassword) {
      updateData.portalPassword = await bcrypt.hash(portalPassword, 10);
    }

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedClient);
  } catch (err: any) {
    console.error('Client update error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Cascade safety or delete orders first (in our schema orders reference clients.
    // For simplicity, delete communications and tasks linked, then orders, then client).
    // Let's perform transaction deletion.
    const clientId = params.id;

    await prisma.$transaction([
      prisma.communication.deleteMany({ where: { clientId } }),
      prisma.task.deleteMany({
        where: {
          order: { clientId }
        }
      }),
      prisma.garment.deleteMany({
        where: {
          order: { clientId }
        }
      }),
      prisma.order.deleteMany({ where: { clientId } }),
      prisma.client.delete({ where: { id: clientId } }),
    ]);

    return NextResponse.json({ message: 'Client and all associated records deleted successfully' });
  } catch (err: any) {
    console.error('Client delete error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

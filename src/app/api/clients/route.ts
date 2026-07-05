import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const userRole = (session.user as any).role;
    let ownerId = (session.user as any).id;

    if (userRole === 'STAFF') {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (admin) ownerId = admin.id;
    }

    const clients = await prisma.client.findMany({
      where: {
        userId: ownerId,
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            dueDate: true,
          },
        },
        communications: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(clients);
  } catch (err: any) {
    console.error('Clients GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    let ownerId = (session.user as any).id;

    if (userRole === 'STAFF') {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (admin) ownerId = admin.id;
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

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    const emailKey = email?.toLowerCase().trim() || null;

    if (emailKey) {
      const existingClient = await prisma.client.findUnique({
        where: { email: emailKey },
      });
      if (existingClient) {
        return NextResponse.json({ error: 'A client with this email already exists' }, { status: 400 });
      }
    }

    let rawTempPassword = null;
    let hashedPortalPassword = null;

    if (portalPassword) {
      hashedPortalPassword = await bcrypt.hash(portalPassword, 10);
    } else {
      // Auto-generate a secure 8-character temporary password
      rawTempPassword = Math.random().toString(36).slice(-8);
      hashedPortalPassword = await bcrypt.hash(rawTempPassword, 10);
    }

    const newClient = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email: emailKey,
        phone,
        address,
        notes,
        measurements: measurements || {},
        portalPassword: hashedPortalPassword,
        needsPasswordChange: true, // Force password change on next login
        userId: ownerId,
      },
    });

    // Return the auto-generated password just this once so the admin can share it
    return NextResponse.json({ 
      ...newClient, 
      tempPassword: rawTempPassword 
    });
  } catch (err: any) {
    console.error('Client POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

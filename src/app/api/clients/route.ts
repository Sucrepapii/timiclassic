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
    if (emailKey) {
      const { sendEmail } = await import('@/lib/resend');
      const passToSend = portalPassword || rawTempPassword;
      try {
        await sendEmail({
          to: emailKey,
          subject: 'Welcome to Timiclassic Client Portal',
          html: `<div style="font-family: serif; color: #2d2d2d; padding: 20px; background-color: #fbfaf7;">
            <h2 style="color: #000; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">TIMICLASSIC</h2>
            <p style="font-size: 14px; line-height: 1.6;">Hello ${firstName},</p>
            <p style="font-size: 14px; line-height: 1.6;">A client portal account has been created for you.</p>
            <p style="font-size: 14px; line-height: 1.6;">Your temporary password is: <strong>${passToSend}</strong></p>
            <p style="font-size: 14px; line-height: 1.6;">Please log in to track your orders and measurements. You will be required to change your password immediately upon your first login.</p>
            <hr style="border: 0; border-top: 1px solid #e5e5e5; margin-top: 30px;" />
            <p style="font-size: 11px; color: #8e8e88; text-transform: uppercase; letter-spacing: 1px;">Timiclassic Fashion Designer</p>
          </div>`,
        });
      } catch (e) {
        console.error('Failed to send welcome email', e);
      }
    }

    return NextResponse.json({ 
      ...newClient, 
      tempPassword: rawTempPassword 
    });
  } catch (err: any) {
    console.error('Client POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

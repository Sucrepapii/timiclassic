import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staff = await prisma.user.findMany({
      where: { role: 'STAFF' },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STAFF',
        needsPasswordChange: true,
      },
    });

    const { sendEmail } = await import('@/lib/resend');
    await sendEmail({
      to: email,
      subject: 'Welcome to Timiclassic Command Center',
      html: `<div style="font-family: serif; color: #2d2d2d; padding: 20px; background-color: #fbfaf7;">
        <h2 style="color: #000; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">TIMICLASSIC</h2>
        <p style="font-size: 14px; line-height: 1.6;">Hello ${name},</p>
        <p style="font-size: 14px; line-height: 1.6;">An administrator has created a staff account for you on the Timiclassic Command Center.</p>
        <p style="font-size: 14px; line-height: 1.6;">Your temporary password is: <strong>${password}</strong></p>
        <p style="font-size: 14px; line-height: 1.6;">Please log in to the portal. You will be required to change your password immediately upon your first login.</p>
        <hr style="border: 0; border-top: 1px solid #e5e5e5; margin-top: 30px;" />
        <p style="font-size: 11px; color: #8e8e88; text-transform: uppercase; letter-spacing: 1px;">Timiclassic Fashion Designer Command Center</p>
      </div>`,
    });

    return NextResponse.json({ success: true, user: { id: newStaff.id, name: newStaff.name, email: newStaff.email } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

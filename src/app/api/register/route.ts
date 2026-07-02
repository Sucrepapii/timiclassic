import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: lowerEmail,
        password: hashedPassword,
        role: 'ADMIN', // Default registered user to ADMIN for full designer control
      },
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

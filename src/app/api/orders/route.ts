import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const clientId = searchParams.get('clientId') || '';

    const userRole = (session.user as any).role;
    let ownerId = (session.user as any).id;

    if (userRole === 'STAFF') {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (admin) ownerId = admin.id;
    }

    const whereClause: any = { userId: ownerId };
    if (status) whereClause.status = status;
    if (clientId) whereClause.clientId = clientId;

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        garments: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (err: any) {
    console.error('Orders GET error:', err);
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
      clientId,
      status,
      priority,
      totalAmount,
      depositPaid,
      depositDate,
      dueDate,
      notes,
      garments, // Array of garments
    } = body;

    if (!clientId) {
      return NextResponse.json({ error: 'Client selection is required' }, { status: 400 });
    }

    // Auto-generate order number (e.g. ORD-2026-001)
    const currentYear = new Date().getFullYear();
    const orderPrefix = `ORD-${currentYear}-`;
    
    // Count orders starting with prefix
    const ordersCount = await prisma.order.count({
      where: {
        orderNumber: {
          startsWith: orderPrefix,
        },
      },
    });

    const nextOrderNumber = `${orderPrefix}${(ordersCount + 1).toString().padStart(3, '0')}`;

    // Calculate balance due
    const finalTotal = totalAmount ? parseFloat(totalAmount) : 0;
    const deposit = depositPaid ? parseFloat(depositPaid) : 0;
    const balanceDue = Math.max(0, finalTotal - deposit);

    // Create Order with garments nested
    const newOrder = await prisma.order.create({
      data: {
        orderNumber: nextOrderNumber,
        clientId,
        status: status || 'DRAFT',
        priority: priority || 'MEDIUM',
        totalAmount: finalTotal,
        depositPaid: deposit,
        depositDate: depositDate ? new Date(depositDate) : null,
        balanceDue,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        userId: ownerId,
        garments: {
          create: garments?.map((g: any) => ({
            name: g.name,
            description: g.description || '',
            designFiles: g.designFiles || [],
            fabricType: g.fabricType || '',
            color: g.color || '',
            pattern: g.pattern || '',
            measurements: g.measurements || {},
          })) || [],
        },
      },
      include: {
        garments: true,
      },
    });

    return NextResponse.json(newOrder);
  } catch (err: any) {
    console.error('Order POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

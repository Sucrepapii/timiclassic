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

    const userId = (session.user as any).id;

    // 1. Client count
    const clientCount = await prisma.client.count({
      where: { userId },
    });

    // 2. Active orders (excludes Completed, Delivered, Cancelled)
    const activeOrders = await prisma.order.count({
      where: {
        userId,
        status: {
          notIn: ['COMPLETED', 'DELIVERED', 'CANCELLED'],
        },
      },
    });

    // 3. Tasks due (includes Todo, In Progress, Review, Blocked)
    const tasksDue = await prisma.task.count({
      where: {
        order: { userId },
        status: {
          notIn: ['DONE'],
        },
        dueDate: {
          not: null,
        },
      },
    });

    // 4. Monthly revenue (sum totalAmount for orders created this month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const revenueResult = await prisma.order.aggregate({
      where: {
        userId,
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      _sum: {
        totalAmount: true,
        depositPaid: true,
      },
    });

    const revenueThisMonth = revenueResult._sum.totalAmount || 0;
    const depositsThisMonth = revenueResult._sum.depositPaid || 0;

    // 5. Total business revenue (cumulative total amount of completed/delivered/confirmed orders)
    const allTimeResult = await prisma.order.aggregate({
      where: {
        userId,
        status: {
          in: ['CONFIRMED', 'DESIGN_PHASE', 'FABRIC_SOURCING', 'CUTTING', 'SEWING', 'FITTING', 'QUALITY_CHECK', 'COMPLETED', 'DELIVERED'],
        },
      },
      _sum: {
        totalAmount: true,
      },
    });
    const allTimeRevenue = allTimeResult._sum.totalAmount || 0;

    // 6. Revenue trends (last 6 months)
    const revenueTrends = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const monthSum = await prisma.order.aggregate({
        where: {
          userId,
          createdAt: { gte: start, lte: end },
          status: { not: 'CANCELLED' },
        },
        _sum: { totalAmount: true },
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      revenueTrends.push({
        name: monthNames[d.getMonth()],
        revenue: monthSum._sum.totalAmount || 0,
      });
    }

    // 7. Popular garment types (grouped by garment name)
    const garments = await prisma.garment.findMany({
      where: {
        order: { userId },
      },
      select: {
        name: true,
      },
    });

    const garmentCounts: Record<string, number> = {};
    garments.forEach((g) => {
      const cleanName = g.name.trim();
      garmentCounts[cleanName] = (garmentCounts[cleanName] || 0) + 1;
    });

    const popularGarments = Object.entries(garmentCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // 8. Recent orders (latest 5)
    const recentOrders = await prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      metrics: {
        clientCount,
        activeOrders,
        tasksDue,
        revenueThisMonth,
        depositsThisMonth,
        allTimeRevenue,
      },
      charts: {
        revenueTrends,
        popularGarments,
      },
      recentOrders,
    });
  } catch (err: any) {
    console.error('Analytics GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

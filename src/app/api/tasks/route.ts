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
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');

    const userId = (session.user as any).id;

    const whereClause: any = {
      order: {
        userId,
      },
    };

    if (orderId) whereClause.orderId = orderId;
    if (status) whereClause.status = status;

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            orderNumber: true,
            client: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        garment: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(tasks);
  } catch (err: any) {
    console.error('Tasks GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      status,
      priority,
      orderId,
      garmentId,
      dueDate,
      notes,
    } = body;

    if (!title || !orderId) {
      return NextResponse.json({ error: 'Task title and orderId are required' }, { status: 400 });
    }

    const userId = (session.user as any).id;

    // Verify order belongs to active designer
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        orderId,
        garmentId: garmentId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
        assignedTo: userId, // Auto-assign to the creator (solo designer)
      },
    });

    return NextResponse.json(newTask);
  } catch (err: any) {
    console.error('Task POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, status, addTime, completed } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (status) {
      updateData.status = status;
      if (status === 'DONE') {
        updateData.completedAt = new Date();
      }
    }

    if (completed !== undefined) {
      updateData.status = completed ? 'DONE' : 'TODO';
      updateData.completedAt = completed ? new Date() : null;
    }

    if (addTime !== undefined) {
      const currentHours = existingTask.timeSpent || 0;
      updateData.timeSpent = currentHours + parseFloat(addTime);
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json(updatedTask);
  } catch (err: any) {
    console.error('Task PATCH error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

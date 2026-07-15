import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        garments: true,
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
        communications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
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
      status,
      priority,
      totalAmount,
      depositPaid,
      depositDate,
      dueDate,
      notes,
      garments,
    } = body;

    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { garments: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const finalTotal = totalAmount !== undefined ? parseFloat(totalAmount) : (existingOrder.totalAmount || 0);
    const deposit = depositPaid !== undefined ? parseFloat(depositPaid) : (existingOrder.depositPaid || 0);
    const balanceDue = Math.max(0, finalTotal - deposit);

    // Dynamic garment updates (we delete previous ones and re-insert, or patch them.
    // For simplicity, let's delete previous garments and re-insert if garments array is provided)
    const orderData: any = {
      status: status || existingOrder.status,
      priority: priority || existingOrder.priority,
      totalAmount: finalTotal,
      depositPaid: deposit,
      depositDate: depositDate ? new Date(depositDate) : existingOrder.depositDate,
      balanceDue,
      dueDate: dueDate ? new Date(dueDate) : existingOrder.dueDate,
      notes: notes !== undefined ? notes : existingOrder.notes,
    };

    if (garments && Array.isArray(garments)) {
      // Perform database transaction to delete existing garments and create new ones
      await prisma.$transaction([
        prisma.garment.deleteMany({ where: { orderId: params.id } }),
        prisma.order.update({
          where: { id: params.id },
          data: {
            ...orderData,
            garments: {
              create: garments.map((g: any) => ({
                name: g.name,
                description: g.description || '',
                designFiles: g.designFiles || [],
                fabricType: g.fabricType || '',
                color: g.color || '',
                pattern: g.pattern || '',
                measurements: g.measurements || {},
              })),
            },
          },
        }),
      ]);
    } else {
      await prisma.order.update({
        where: { id: params.id },
        data: orderData,
      });
    }

    if (status && status !== existingOrder.status) {
      // Notify client of status change
      const niceStatus = status.replace('_', ' ');
      const content = `Automated Update: Your order ${existingOrder.orderNumber} has progressed to the ${niceStatus} phase.`;

      let logType = 'NOTE';
      let logStatus = '';

      if (existingOrder.client.email) {
        const { sendEmail } = await import('@/lib/resend');
        try {
          const emailResult = await sendEmail({
            to: existingOrder.client.email,
            subject: `Order Update: ${existingOrder.orderNumber}`,
            html: `<div style="font-family: serif; color: #2d2d2d; padding: 20px; background-color: #fbfaf7;">
              <h2 style="color: #000; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">TIMICLASSIC</h2>
              <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${content}</p>
              <hr style="border: 0; border-top: 1px solid #e5e5e5; margin-top: 30px;" />
              <p style="font-size: 11px; color: #8e8e88; text-transform: uppercase; letter-spacing: 1px;">Timiclassic Fashion Designer Command Center</p>
            </div>`,
          });

          if (emailResult.success) {
            logType = 'EMAIL';
            logStatus = '\n\n[Status: Sent via Resend]';
          } else {
            logStatus = '\n\n[Status: Resend API failed, logged locally]';
          }
        } catch (error) {
          logStatus = '\n\n[Status: Resend connection error, logged locally]';
        }
      }

      await prisma.communication.create({
        data: {
          clientId: existingOrder.clientId,
          orderId: existingOrder.id,
          type: logType as any,
          direction: 'OUTBOUND',
          content: content + logStatus,
        }
      });
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { garments: true },
    });

    return NextResponse.json(updatedOrder);
  } catch (err: any) {
    console.error('Order update error:', err);
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

    const orderId = params.id;

    await prisma.$transaction([
      prisma.task.deleteMany({ where: { orderId } }),
      prisma.garment.deleteMany({ where: { orderId } }),
      prisma.communication.deleteMany({ where: { orderId } }),
      prisma.order.delete({ where: { id: orderId } }),
    ]);

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (err: any) {
    console.error('Order delete error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

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
    const clientId = searchParams.get('clientId');

    const userRole = (session.user as any).role;
    let ownerId = (session.user as any).id;

    if (userRole === 'STAFF') {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (admin) ownerId = admin.id;
    }

    const whereClause: any = {
      client: {
        userId: ownerId,
      },
    };

    if (clientId) whereClause.clientId = clientId;

    const communications = await prisma.communication.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(communications);
  } catch (err: any) {
    console.error('Communications GET error:', err);
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
      clientId,
      orderId,
      type, // EMAIL, WHATSAPP, SMS, PHONE, NOTE, MEETING
      direction, // INBOUND, OUTBOUND
      subject,
      content,
    } = body;

    if (!clientId || !content) {
      return NextResponse.json({ error: 'Client selection and message content are required' }, { status: 400 });
    }

    const userRole = (session.user as any).role;
    let ownerId = (session.user as any).id;

    if (userRole === 'STAFF') {
      return NextResponse.json({ error: 'Staff members are not allowed to communicate directly with clients' }, { status: 403 });
    }

    let client;
    if (userRole === 'CLIENT') {
      // Client is sending message to designer
      if (clientId !== ownerId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      client = await prisma.client.findUnique({
        where: { id: clientId },
      });
    } else {
      // Designer/Staff is sending message to client
      client = await prisma.client.findFirst({
        where: { id: clientId, userId: ownerId },
      });
    }

    if (!client) {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
    }

    let externalId = null;
    let sendStatus = 'Logged locally';

    // If type is email and direction is outbound, attempt to send via Resend
    if (type === 'EMAIL' && direction === 'OUTBOUND' && client.email) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: 'Timiclassic Command <designer@timiclassic.com>', // User can replace this domain later
              to: client.email,
              subject: subject || 'Update regarding your Timiclassic Order',
              html: `<div style="font-family: serif; color: #2d2d2d; padding: 20px; background-color: #fbfaf7;">
                <h2 style="color: #000; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">TIMICLASSIC</h2>
                <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${content}</p>
                <hr style="border: 0; border-top: 1px solid #e5e5e5; margin-top: 30px;" />
                <p style="font-size: 11px; color: #8e8e88; text-transform: uppercase; tracking-widest: 1px;">Timiclassic Fashion Designer Command Center</p>
              </div>`,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            externalId = data.id;
            sendStatus = 'Sent via Resend';
          } else {
            console.error('Failed to send email via Resend API response code:', res.status);
            sendStatus = 'Resend API failed, logged locally';
          }
        } catch (mailError) {
          console.error('Resend service request error:', mailError);
          sendStatus = 'Resend connection error, logged locally';
        }
      } else {
        sendStatus = 'Simulation Mode: Email log recorded (No Resend API Key)';
      }
    }

    const newComm = await prisma.communication.create({
      data: {
        type: type || 'NOTE',
        direction: direction || 'OUTBOUND',
        subject: subject || (type === 'NOTE' ? 'Designer Note' : `${type} Log`),
        content: content + (direction === 'OUTBOUND' && type === 'EMAIL' ? `\n\n[Status: ${sendStatus}]` : ''),
        clientId,
        orderId: orderId || null,
        externalId,
      },
    });

    return NextResponse.json(newComm);
  } catch (err: any) {
    console.error('Communication POST error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

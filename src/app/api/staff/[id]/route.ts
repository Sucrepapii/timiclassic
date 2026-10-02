import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, isActive } = await req.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
      updateData.needsPasswordChange = true;
    }

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { email, NOT: { id: params.id } },
      });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already in use by another account' }, { status: 400 });
      }
    }

    const updatedStaff = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: { id: updatedStaff.id, name: updatedStaff.name, email: updatedStaff.email, isActive: updatedStaff.isActive } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const hardDelete = searchParams.get('hard') === 'true';

    if (hardDelete) {
      try {
        await prisma.user.delete({
          where: { id: params.id },
        });
        return NextResponse.json({ success: true, message: 'Staff member permanently deleted.' });
      } catch (err: any) {
        if (err.code === 'P2003') {
          return NextResponse.json({ error: 'Cannot permanently delete this staff member because they have associated clients or orders. Please deactivate them instead.' }, { status: 400 });
        }
        throw err;
      }
    }

    // Soft delete by setting isActive to false
    await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Staff member deactivated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

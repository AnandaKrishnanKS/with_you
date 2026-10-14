import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status, reason } = await req.json();

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { supporter: true, member: true },
  });

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  // Only Supporter can accept/decline their own bookings
  if (session.role === 'SUPPORTER') {
    const sp = await prisma.supporterProfile.findUnique({ where: { userId: session.id } });
    if (!sp || booking.supporterId !== sp.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const allowed = ['ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED_BY_SUPPORTER'];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
  }

  // Members can cancel their own bookings
  if (session.role === 'MEMBER') {
    const mp = await prisma.memberProfile.findUnique({ where: { userId: session.id } });
    if (!mp || booking.memberId !== mp.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (status !== 'CANCELLED_BY_MEMBER') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status,
      ...(reason ? { cancelReason: reason } : {}),
      ...(status === 'CANCELLED_BY_MEMBER' || status === 'CANCELLED_BY_SUPPORTER'
        ? { cancelledAt: new Date() }
        : {}),
      ...(status === 'IN_PROGRESS' ? { checkInTime: new Date() } : {}),
      ...(status === 'COMPLETED' ? { checkOutTime: new Date() } : {}),
    },
  });

  return NextResponse.json({ booking: updated });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getRegionConfig } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'MEMBER') {
      return NextResponse.json({ error: 'Unauthorized. Member access required.' }, { status: 401 });
    }

    const body = await req.json();
    const { supporterId, serviceId, mode, scheduledAt, durationHours, meetingLocation, notes } = body;

    if (!supporterId || !serviceId || !mode || !scheduledAt || !durationHours) {
      return NextResponse.json({ error: 'Missing required booking fields.' }, { status: 400 });
    }

    // Get member profile
    const memberProfile = await prisma.memberProfile.findUnique({
      where: { userId: session.id },
    });

    if (!memberProfile) {
      return NextResponse.json({ error: 'Member profile not found.' }, { status: 404 });
    }

    // Get region configuration (Kerala/IN)
    const config = await getRegionConfig('KL');
    const hourlyRate = config.hourlyBookingFee;
    const commissionPercent = config.platformCommissionPercent;

    const duration = parseFloat(durationHours);
    const subtotal = hourlyRate * duration;
    const platformFee = (subtotal * commissionPercent) / 100;
    const supporterEarnings = subtotal - platformFee;

    // Create booking and mock payment record in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          memberId: memberProfile.id,
          supporterId,
          serviceId,
          mode,
          status: 'REQUESTED',
          scheduledAt: new Date(scheduledAt),
          durationHours: duration,
          meetingLocation: meetingLocation || (mode === 'VIDEO_CALL' ? 'Online Video Call' : 'To be agreed'),
          notes: notes || '',
          hourlyRate,
          totalAmount: subtotal,
          platformFee,
          supporterEarnings,
        },
      });

      // Create mock payment transaction
      await tx.payment.create({
        data: {
          bookingId: newBooking.id,
          userId: session.id,
          amount: subtotal,
          currency: config?.currency ?? 'INR',
          razorpayPaymentId: `mock_tx_${Date.now()}`,
          status: 'COMPLETED',
          providerMode: 'mock',
        },
      });

      return newBooking;
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

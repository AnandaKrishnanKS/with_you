import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'MEMBER') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required review fields.' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        memberId: session.id,
        supporterId: booking.supporterId,
        rating: Number(rating),
        comment,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, notes } = body; // action: 'APPROVE' | 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be APPROVE or REJECT.' }, { status: 400 });
    }

    const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    const supporter = await prisma.supporterProfile.update({
      where: { id },
      data: {
        verificationStatus: status,
      },
    });

    // Update KYC verification record status if exists
    await prisma.kycVerification.updateMany({
      where: { supporterId: id },
      data: {
        status: action === 'APPROVE' ? 'VERIFIED' : 'REJECTED',
        rejectReason: action === 'REJECT' ? (notes || 'Document verification failed') : null,
      },
    });

    return NextResponse.json({ success: true, supporter });
  } catch (error: any) {
    console.error('KYC verification update error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

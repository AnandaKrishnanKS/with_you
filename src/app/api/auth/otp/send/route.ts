import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOtp } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Valid 10-digit phone number required' }, { status: 400 });
    }

    await createOtp(phone);

    return NextResponse.json({
      ok: true,
      message: process.env.PROVIDER_MODE === 'mock'
        ? 'OTP sent (mock mode). Use 123456.'
        : 'OTP sent to your phone.',
    });
  } catch (err) {
    console.error('OTP send error:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

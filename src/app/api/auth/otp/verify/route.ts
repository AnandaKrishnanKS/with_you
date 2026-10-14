import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOtp, signToken, COOKIE_NAME, type SessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 });
    }

    const isValid = await verifyOtp(phone, code);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Find existing user
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      // Return verified=true so frontend can proceed with registration
      return NextResponse.json({ verified: true, newUser: true, phone });
    }

    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as SessionUser['role'],
      status: user.status,
    };

    const token = await signToken(sessionUser);
    const response = NextResponse.json({ verified: true, newUser: false, user: sessionUser });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('OTP verify error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const accept = req.headers.get('accept') || '';
  const isFetch = accept.includes('application/json') || req.headers.get('x-requested-with') === 'XMLHttpRequest';

  const response = isFetch
    ? NextResponse.json({ ok: true, redirect: '/login' })
    : NextResponse.redirect(new URL('/login', req.url), 303);

  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', req.url), 303);
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}

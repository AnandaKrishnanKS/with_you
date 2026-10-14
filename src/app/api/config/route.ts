import { NextResponse } from 'next/server';
import { getRegionConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = await getRegionConfig('KL');
  return NextResponse.json(config);
}

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'with_you_super_secret_jwt_key_2026_dev';
const COOKIE_NAME = 'wy_token';

export type UserRole = 'MEMBER' | 'SUPPORTER' | 'ADMIN';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: string;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncodeBytes(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecodeToBytes(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlEncodeString(str: string): string {
  return base64UrlEncodeBytes(encoder.encode(str).buffer);
}

function base64UrlDecodeString(str: string): string {
  return decoder.decode(base64UrlDecodeToBytes(str));
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Sign a JWT token using Web Crypto
export async function signToken(user: SessionUser): Promise<string> {
  const header = base64UrlEncodeString(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncodeString(
    JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 })
  );
  const data = `${header}.${payload}`;
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const signature = base64UrlEncodeBytes(signatureBuffer);
  return `${data}.${signature}`;
}

// Verify a JWT token using Web Crypto
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const data = `${header}.${payload}`;
    const key = await getHmacKey();
    const sigBytes = base64UrlDecodeToBytes(signature);
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes as unknown as BufferSource, encoder.encode(data));
    if (!valid) return null;

    const decodedPayload = JSON.parse(base64UrlDecodeString(payload));
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    const { exp, iat, ...user } = decodedPayload;
    return user as SessionUser;
  } catch {
    return null;
  }
}

// Get session from cookies (Server Component safe)
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify a password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate and store OTP
export async function createOtp(phone: string): Promise<string> {
  const providerMode = process.env.PROVIDER_MODE || 'mock';
  // In mock mode, OTP is always 123456
  const code = providerMode === 'mock' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  const hashed = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Invalidate any previous OTPs for this phone
  await prisma.otpCode.updateMany({
    where: { phone, verified: false },
    data: { verified: true },
  });

  await prisma.otpCode.create({
    data: { phone, code: hashed, expiresAt },
  });

  if (providerMode !== 'mock') {
    // TODO: send real SMS via MSG91
    console.log(`[SMS] Sending OTP ${code} to ${phone}`);
  } else {
    console.log(`[MOCK SMS] OTP for ${phone}: ${code}`);
  }

  return code;
}

// Verify an OTP
export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const otpRecord = await prisma.otpCode.findFirst({
    where: { phone, verified: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) return false;

  const isValid = await bcrypt.compare(code, otpRecord.code);
  if (!isValid) return false;

  await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { verified: true } });
  return true;
}

export { COOKIE_NAME };

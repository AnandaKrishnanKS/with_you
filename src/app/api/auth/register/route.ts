import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      role, // 'MEMBER' | 'SUPPORTER'
      name,
      email,
      phone,
      password,
      city,
      districtId,
      emergencyContactName,
      emergencyContactPhone,
      gender,
      shortBio,
      languages,
      services, // Array of service IDs for supporter
    } = body;

    if (!role || !name || !email || !phone || !password || !districtId) {
      return NextResponse.json({ error: 'Missing required registration fields.' }, { status: 400 });
    }

    // Check if user already exists with email or phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email or phone number already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const membershipExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          phone,
          email,
          passwordHash,
          name,
          role,
          status: 'ACTIVE',
        },
      });

      // Record consent
      await tx.consentRecord.create({
        data: { userId: user.id, consentType: 'TERMS_AND_PRIVACY', accepted: true },
      });
      await tx.consentRecord.create({
        data: { userId: user.id, consentType: 'DPDP_CONSENT', accepted: true },
      });

      if (role === 'MEMBER') {
        const memberProfile = await tx.memberProfile.create({
          data: {
            userId: user.id,
            city: city || 'Kochi',
            districtId,
            emergencyContactName: emergencyContactName || '',
            emergencyContactPhone: emergencyContactPhone || '',
            membershipStatus: 'ACTIVE',
            membershipExpiresAt: membershipExpiry,
          },
        });

        const fee = 199;
        await tx.membership.create({
          data: {
            userId: user.id,
            role: 'MEMBER',
            amount: fee,
            validFrom: new Date(),
            validUntil: membershipExpiry,
            status: 'ACTIVE',
          },
        });

        return { user, profile: memberProfile };
      } else if (role === 'SUPPORTER') {
        const supporterProfile = await tx.supporterProfile.create({
          data: {
            userId: user.id,
            gender: gender || 'PREFER_NOT_TO_SAY',
            city: city || 'Kochi',
            districtId,
            shortBio: shortBio || 'Eager to provide platonic companionship and assistance.',
            languages: JSON.stringify(languages || ['Malayalam', 'English']),
            emergencyContactName: emergencyContactName || '',
            emergencyContactPhone: emergencyContactPhone || '',
            availabilityStatus: 'OFFLINE',
            verificationStatus: 'PENDING',
            reliabilityScore: 100.0,
            membershipStatus: 'ACTIVE',
            membershipExpiresAt: membershipExpiry,
          },
        });

        // Add selected services if any provided
        if (services && Array.isArray(services)) {
          for (const serviceId of services) {
            await tx.supporterService.create({
              data: {
                supporterId: supporterProfile.id,
                serviceId,
              },
            });
          }
        }

        // Add mock pending KYC verification record
        await tx.kycVerification.create({
          data: {
            supporterId: supporterProfile.id,
            providerRef: `mock_kyc_${user.id.substring(0, 8)}`,
            last4Aadhaar: '9999',
            selfieUrl: '/kyc/pending-selfie.jpg',
            livenessScore: 99.0,
            faceMatchScore: 98.0,
            status: 'PENDING',
          },
        });

        const fee = 499;
        await tx.membership.create({
          data: {
            userId: user.id,
            role: 'SUPPORTER',
            amount: fee,
            validFrom: new Date(),
            validUntil: membershipExpiry,
            status: 'ACTIVE',
          },
        });

        return { user, profile: supporterProfile };
      }

      throw new Error('Invalid user role specified.');
    });

    // Create session token and set cookie
    const token = await signToken({
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone,
      role: result.user.role as any,
      status: result.user.status,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 500 });
  }
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { addDays, addHours, subDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding WITH YOU database...');

  // ─── Region & Districts ──────────────────────────────────────────────────────
  const kerala = await prisma.region.upsert({
    where: { code: 'KL' },
    update: {},
    create: {
      code: 'KL',
      name: 'Kerala',
      country: 'IN',
      active: true,
      configs: {
        create: {
          memberYearlyFee: 199,
          supporterYearlyFee: 499,
          hourlyBookingFee: 399,
          platformCommissionPercent: 20,
          currency: 'INR',
          taxPercent: 18,
          cancelFullRefundHours: 24,
          cancelPartialRefundHours: 2,
          cancelPartialRefundPercent: 50,
        },
      },
    },
  });

  const districtNames = [
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod',
  ];

  const districts: Record<string, string> = {};
  for (const name of districtNames) {
    const d = await prisma.district.upsert({
      where: { id: `district-${name.toLowerCase()}` },
      update: {},
      create: {
        id: `district-${name.toLowerCase()}`,
        regionId: kerala.id,
        name,
        state: 'Kerala',
      },
    });
    districts[name] = d.id;
  }

  // ─── Services ────────────────────────────────────────────────────────────────
  const serviceDefs = [
    {
      key: 'EMOTIONAL_SUPPORT',
      name: 'Emotional Support',
      description: 'A compassionate companion to listen, talk, and provide emotional comfort.',
      icon: 'HeartHandshake',
      allowedModes: JSON.stringify(['IN_PERSON', 'VIDEO_CALL']),
    },
    {
      key: 'OUTINGS_COMPANION',
      name: 'Outings Companion',
      description: 'Join you for dinner, movies, cafés, walks, and social outings.',
      icon: 'Coffee',
      allowedModes: JSON.stringify(['IN_PERSON']),
    },
    {
      key: 'EVENT_COMPANION',
      name: 'Event Companion',
      description: 'Accompany you to functions, weddings, family events, and celebrations.',
      icon: 'PartyPopper',
      allowedModes: JSON.stringify(['IN_PERSON']),
    },
    {
      key: 'ELDER_CARE',
      name: 'Elder Care Companionship',
      description: 'Friendly conversation, hospital visit company, and gentle walks for seniors.',
      icon: 'Users',
      allowedModes: JSON.stringify(['IN_PERSON', 'VIDEO_CALL']),
    },
    {
      key: 'HOUSEHOLD_HELP',
      name: 'Household Help',
      description: 'Light errands, organizing, and grocery shopping assistance.',
      icon: 'ShoppingBag',
      allowedModes: JSON.stringify(['IN_PERSON']),
    },
    {
      key: 'LOCAL_TRAVEL_PARTNER',
      name: 'Local Travel Partner',
      description: 'Sightseeing and day trips within the city or district.',
      icon: 'Map',
      allowedModes: JSON.stringify(['IN_PERSON']),
    },
  ];

  const serviceIds: Record<string, string> = {};
  for (const def of serviceDefs) {
    const svc = await prisma.service.upsert({
      where: { key: def.key },
      update: {},
      create: def,
    });
    serviceIds[def.key] = svc.id;
  }

  // ─── Passwords ───────────────────────────────────────────────────────────────
  const memberHash = await bcrypt.hash('Member@123', 12);
  const supporterHash = await bcrypt.hash('Supporter@123', 12);
  const adminHash = await bcrypt.hash('Admin@123', 12);

  // ─── Admin ───────────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: 'admin@withyou.test' },
    update: {},
    create: {
      id: 'user-admin',
      phone: '9000000000',
      email: 'admin@withyou.test',
      passwordHash: adminHash,
      name: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // ─── Member: Anjali Menon ────────────────────────────────────────────────────
  const anjali = await prisma.user.upsert({
    where: { email: 'member@withyou.test' },
    update: {},
    create: {
      id: 'user-anjali',
      phone: '9000000001',
      email: 'member@withyou.test',
      passwordHash: memberHash,
      name: 'Anjali Menon',
      role: 'MEMBER',
      status: 'ACTIVE',
    },
  });

  const membershipExpiry = addDays(new Date(), 365);

  const anjaliProfile = await prisma.memberProfile.upsert({
    where: { userId: anjali.id },
    update: {},
    create: {
      id: 'profile-anjali',
      userId: anjali.id,
      dateOfBirth: new Date('1994-05-12'),
      city: 'Kochi',
      districtId: districts['Ernakulam'],
      emergencyContactName: 'Priya Menon',
      emergencyContactPhone: '9876543210',
      membershipStatus: 'ACTIVE',
      membershipExpiresAt: membershipExpiry,
    },
  });

  await prisma.membership.upsert({
    where: { id: 'mem-anjali' },
    update: {},
    create: {
      id: 'mem-anjali',
      userId: anjali.id,
      role: 'MEMBER',
      amount: 199,
      validFrom: new Date(),
      validUntil: membershipExpiry,
      status: 'ACTIVE',
    },
  });

  for (const consentType of ['TERMS_AND_PRIVACY', 'DPDP_CONSENT']) {
    await prisma.consentRecord.create({
      data: { userId: anjali.id, consentType, accepted: true },
    });
  }

  // ─── Supporter: Arjun Nair ───────────────────────────────────────────────────
  const arjun = await prisma.user.upsert({
    where: { email: 'supporter@withyou.test' },
    update: {},
    create: {
      id: 'user-arjun',
      phone: '9000000002',
      email: 'supporter@withyou.test',
      passwordHash: supporterHash,
      name: 'Arjun Nair',
      role: 'SUPPORTER',
      status: 'ACTIVE',
    },
  });

  const arjunProfile = await prisma.supporterProfile.upsert({
    where: { userId: arjun.id },
    update: {},
    create: {
      id: 'profile-arjun',
      userId: arjun.id,
      dateOfBirth: new Date('1990-08-20'),
      gender: 'MALE',
      address: 'Kakkanad, Kochi',
      city: 'Kochi',
      districtId: districts['Ernakulam'],
      languages: JSON.stringify(['Malayalam', 'English', 'Hindi']),
      shortBio:
        'Warm, patient, and empathetic — I love connecting with people and making their day a little brighter. Whether it\'s a walk, a conversation, or company at an event, I am here with you.',
      photoUrl: '/avatars/arjun.svg',
      emergencyContactName: 'Rajan Nair',
      emergencyContactPhone: '9876543211',
      availabilityStatus: 'ONLINE',
      verificationStatus: 'APPROVED',
      reliabilityScore: 98.5,
      memberGenderPref: 'ANY',
      membershipStatus: 'ACTIVE',
      membershipExpiresAt: membershipExpiry,
    },
  });

  // KYC for Arjun
  await prisma.kycVerification.upsert({
    where: { supporterId: arjunProfile.id },
    update: {},
    create: {
      id: 'kyc-arjun',
      supporterId: arjunProfile.id,
      providerRef: 'mock-kyc-ref-arjun-001',
      last4Aadhaar: '4521',
      selfieUrl: '/kyc/arjun-selfie.jpg',
      livenessScore: 99.8,
      faceMatchScore: 97.5,
      status: 'VERIFIED',
      verifiedAt: subDays(new Date(), 30),
    },
  });

  // Services for Arjun
  for (const key of ['EMOTIONAL_SUPPORT', 'OUTINGS_COMPANION', 'ELDER_CARE', 'LOCAL_TRAVEL_PARTNER']) {
    await prisma.supporterService.upsert({
      where: {
        supporterId_serviceId: { supporterId: arjunProfile.id, serviceId: serviceIds[key] },
      },
      update: {},
      create: {
        supporterId: arjunProfile.id,
        serviceId: serviceIds[key],
      },
    });
  }

  // Availability for next 2 weeks — Mon-Sat 9am-6pm
  for (let day = 1; day <= 6; day++) {
    await prisma.availability.upsert({
      where: { id: `avail-arjun-${day}` },
      update: {},
      create: {
        id: `avail-arjun-${day}`,
        supporterId: arjunProfile.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
      },
    });
  }

  await prisma.membership.upsert({
    where: { id: 'mem-arjun' },
    update: {},
    create: {
      id: 'mem-arjun',
      userId: arjun.id,
      role: 'SUPPORTER',
      amount: 499,
      validFrom: new Date(),
      validUntil: membershipExpiry,
      status: 'ACTIVE',
    },
  });

  // ─── Bookings ────────────────────────────────────────────────────────────────
  // Completed booking 1 — with review
  const booking1 = await prisma.booking.upsert({
    where: { id: 'booking-1' },
    update: {},
    create: {
      id: 'booking-1',
      memberId: anjaliProfile.id,
      supporterId: arjunProfile.id,
      serviceId: serviceIds['EMOTIONAL_SUPPORT'],
      mode: 'VIDEO_CALL',
      status: 'COMPLETED',
      scheduledAt: subDays(new Date(), 14),
      durationHours: 1,
      hourlyRate: 399,
      totalAmount: 399,
      platformFee: 79.8,
      supporterEarnings: 319.2,
      checkInTime: subDays(new Date(), 14),
      checkOutTime: addHours(subDays(new Date(), 14), 1),
    },
  });

  await prisma.review.upsert({
    where: { bookingId: booking1.id },
    update: {},
    create: {
      bookingId: booking1.id,
      memberId: anjali.id,
      supporterId: arjunProfile.id,
      rating: 5,
      comment: 'Arjun was incredibly kind and understanding. The session really helped me.',
    },
  });

  // Completed booking 2 — with review
  const booking2 = await prisma.booking.upsert({
    where: { id: 'booking-2' },
    update: {},
    create: {
      id: 'booking-2',
      memberId: anjaliProfile.id,
      supporterId: arjunProfile.id,
      serviceId: serviceIds['OUTINGS_COMPANION'],
      mode: 'IN_PERSON',
      status: 'COMPLETED',
      scheduledAt: subDays(new Date(), 7),
      durationHours: 2,
      meetingLocation: 'Lulu Mall, Kochi',
      hourlyRate: 399,
      totalAmount: 798,
      platformFee: 159.6,
      supporterEarnings: 638.4,
      checkInTime: subDays(new Date(), 7),
      checkOutTime: addHours(subDays(new Date(), 7), 2),
    },
  });

  await prisma.review.upsert({
    where: { bookingId: booking2.id },
    update: {},
    create: {
      bookingId: booking2.id,
      memberId: anjali.id,
      supporterId: arjunProfile.id,
      rating: 4,
      comment: 'Great outing! Very friendly and fun to be around.',
    },
  });

  // Pending booking (REQUESTED)
  await prisma.booking.upsert({
    where: { id: 'booking-3' },
    update: {},
    create: {
      id: 'booking-3',
      memberId: anjaliProfile.id,
      supporterId: arjunProfile.id,
      serviceId: serviceIds['ELDER_CARE'],
      mode: 'IN_PERSON',
      status: 'REQUESTED',
      scheduledAt: addDays(new Date(), 2),
      durationHours: 3,
      meetingLocation: 'Amrita Hospital, Kochi',
      hourlyRate: 399,
      totalAmount: 1197,
      platformFee: 239.4,
      supporterEarnings: 957.6,
      notes: 'Accompanying my mother to a hospital check-up. Very gentle and patient please.',
    },
  });

  // Upcoming accepted booking
  await prisma.booking.upsert({
    where: { id: 'booking-4' },
    update: {},
    create: {
      id: 'booking-4',
      memberId: anjaliProfile.id,
      supporterId: arjunProfile.id,
      serviceId: serviceIds['LOCAL_TRAVEL_PARTNER'],
      mode: 'IN_PERSON',
      status: 'ACCEPTED',
      scheduledAt: addDays(new Date(), 5),
      durationHours: 4,
      meetingLocation: 'Fort Kochi, Kochi',
      hourlyRate: 399,
      totalAmount: 1596,
      platformFee: 319.2,
      supporterEarnings: 1276.8,
    },
  });

  // ─── Extra mock supporters ─────────────────────────────────────────────────
  const mockSupporters = [
    {
      name: 'Meera Krishnan',
      phone: '9000000010',
      email: 'meera@withyou.test',
      gender: 'FEMALE',
      bio: 'Retired teacher who loves poetry, nature walks, and meaningful conversations.',
      languages: ['Malayalam', 'English'],
      city: 'Thiruvananthapuram',
      district: 'Thiruvananthapuram',
      services: ['EMOTIONAL_SUPPORT', 'ELDER_CARE', 'OUTINGS_COMPANION'],
      photo: '/avatars/meera.svg',
      rating: 4.8,
    },
    {
      name: 'Rahul Dev',
      phone: '9000000011',
      email: 'rahul@withyou.test',
      gender: 'MALE',
      bio: 'Avid traveller and foodie. I make every outing an adventure. Experienced with elderly care.',
      languages: ['Malayalam', 'English', 'Tamil'],
      city: 'Kozhikode',
      district: 'Kozhikode',
      services: ['OUTINGS_COMPANION', 'LOCAL_TRAVEL_PARTNER', 'EVENT_COMPANION'],
      photo: '/avatars/rahul.svg',
      rating: 4.6,
    },
    {
      name: 'Divya Pillai',
      phone: '9000000012',
      email: 'divya@withyou.test',
      gender: 'FEMALE',
      bio: 'Social worker with 5 years of experience in community care. Warm and reliable.',
      languages: ['Malayalam', 'English'],
      city: 'Kochi',
      district: 'Ernakulam',
      services: ['EMOTIONAL_SUPPORT', 'HOUSEHOLD_HELP', 'ELDER_CARE'],
      photo: '/avatars/divya.svg',
      rating: 4.9,
    },
    {
      name: 'Arun Varma',
      phone: '9000000013',
      email: 'arun@withyou.test',
      gender: 'MALE',
      bio: 'Friendly companion for events and trips. I bring positive energy to every outing.',
      languages: ['Malayalam', 'Hindi', 'English'],
      city: 'Thrissur',
      district: 'Thrissur',
      services: ['EVENT_COMPANION', 'OUTINGS_COMPANION', 'LOCAL_TRAVEL_PARTNER'],
      photo: '/avatars/arun.svg',
      rating: 4.5,
    },
    {
      name: 'Lakshmi Nambiar',
      phone: '9000000014',
      email: 'lakshmi@withyou.test',
      gender: 'FEMALE',
      bio: 'Yoga instructor and wellness enthusiast. I offer calming, grounded companionship.',
      languages: ['Malayalam', 'English'],
      city: 'Palakkad',
      district: 'Palakkad',
      services: ['EMOTIONAL_SUPPORT', 'ELDER_CARE', 'OUTINGS_COMPANION'],
      photo: '/avatars/lakshmi.svg',
      rating: 4.7,
    },
  ];

  const mockPassword = await bcrypt.hash('Mock@123', 12);

  for (let i = 0; i < mockSupporters.length; i++) {
    const ms = mockSupporters[i];
    const uid = `user-mock-${i}`;
    const pid = `profile-mock-${i}`;

    const u = await prisma.user.upsert({
      where: { email: ms.email },
      update: {},
      create: {
        id: uid,
        phone: ms.phone,
        email: ms.email,
        passwordHash: mockPassword,
        name: ms.name,
        role: 'SUPPORTER',
        status: 'ACTIVE',
      },
    });

    const sp = await prisma.supporterProfile.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        id: pid,
        userId: u.id,
        gender: ms.gender,
        city: ms.city,
        districtId: districts[ms.district],
        languages: JSON.stringify(ms.languages),
        shortBio: ms.bio,
        photoUrl: ms.photo,
        availabilityStatus: 'ONLINE',
        verificationStatus: 'APPROVED',
        reliabilityScore: ms.rating * 20,
        memberGenderPref: 'ANY',
        membershipStatus: 'ACTIVE',
        membershipExpiresAt: membershipExpiry,
      },
    });

    await prisma.kycVerification.upsert({
      where: { supporterId: sp.id },
      update: {},
      create: {
        supporterId: sp.id,
        providerRef: `mock-kyc-ref-${i}`,
        last4Aadhaar: String(1000 + i * 111),
        selfieUrl: `/kyc/mock-${i}.jpg`,
        livenessScore: 98 + Math.random(),
        faceMatchScore: 96 + Math.random() * 3,
        status: 'VERIFIED',
        verifiedAt: subDays(new Date(), 20 + i),
      },
    });

    for (const skey of ms.services) {
      await prisma.supporterService.upsert({
        where: { supporterId_serviceId: { supporterId: sp.id, serviceId: serviceIds[skey] } },
        update: {},
        create: { supporterId: sp.id, serviceId: serviceIds[skey] },
      });
    }

    for (let day = 1; day <= 6; day++) {
      const avid = `avail-mock-${i}-${day}`;
      await prisma.availability.upsert({
        where: { id: avid },
        update: {},
        create: { id: avid, supporterId: sp.id, dayOfWeek: day, startTime: '10:00', endTime: '19:00' },
      });
    }
  }

  console.log('✅ Seeding complete!');
  console.log('');
  console.log('Test credentials:');
  console.log('  MEMBER   → member@withyou.test   / Member@123   (phone: 9000000001)');
  console.log('  SUPPORTER→ supporter@withyou.test / Supporter@123 (phone: 9000000002)');
  console.log('  ADMIN    → admin@withyou.test     / Admin@123');
  console.log('  Dev OTP  → 123456 (for any phone number)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

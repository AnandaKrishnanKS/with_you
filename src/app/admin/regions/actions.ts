'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateRegionConfigAction(formData: {
  regionId: string;
  memberYearlyFee: number;
  supporterYearlyFee: number;
  hourlyBookingFee: number;
  platformCommissionPercent: number;
}) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  const {
    regionId,
    memberYearlyFee,
    supporterYearlyFee,
    hourlyBookingFee,
    platformCommissionPercent,
  } = formData;

  if (
    isNaN(memberYearlyFee) ||
    isNaN(supporterYearlyFee) ||
    isNaN(hourlyBookingFee) ||
    isNaN(platformCommissionPercent)
  ) {
    return { success: false, error: 'Invalid numeric parameters provided.' };
  }

  // Update or create config for this region
  const existingConfig = await prisma.regionConfig.findFirst({
    where: { regionId },
    orderBy: { updatedAt: 'desc' },
  });

  if (existingConfig) {
    await prisma.regionConfig.update({
      where: { id: existingConfig.id },
      data: {
        memberYearlyFee,
        supporterYearlyFee,
        hourlyBookingFee,
        platformCommissionPercent,
      },
    });
  } else {
    await prisma.regionConfig.create({
      data: {
        regionId,
        memberYearlyFee,
        supporterYearlyFee,
        hourlyBookingFee,
        platformCommissionPercent,
      },
    });
  }

  // Purge/revalidate all caches so every page reflects the updated commission immediately
  revalidatePath('/', 'layout');

  return {
    success: true,
    data: {
      memberYearlyFee,
      supporterYearlyFee,
      hourlyBookingFee,
      platformCommissionPercent,
      supporterSharePercent: Math.max(0, 100 - platformCommissionPercent),
      supporterHourlyEarnings: (hourlyBookingFee * (100 - platformCommissionPercent)) / 100,
      platformHourlyFee: (hourlyBookingFee * platformCommissionPercent) / 100,
    },
  };
}

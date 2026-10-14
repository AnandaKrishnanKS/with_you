import { prisma } from '@/lib/prisma';

export interface RegionConfigData {
  id?: string;
  regionId?: string;
  memberYearlyFee: number;
  supporterYearlyFee: number;
  hourlyBookingFee: number;
  platformCommissionPercent: number;
  supporterSharePercent: number;
  supporterHourlyEarnings: number;
  platformHourlyFee: number;
  currency: string;
  taxPercent: number;
  cancelFullRefundHours: number;
  cancelPartialRefundHours: number;
  cancelPartialRefundPercent: number;
}

const DEFAULT_CONFIG: RegionConfigData = {
  memberYearlyFee: 199,
  supporterYearlyFee: 499,
  hourlyBookingFee: 399,
  platformCommissionPercent: 20,
  supporterSharePercent: 80,
  supporterHourlyEarnings: 319.2,
  platformHourlyFee: 79.8,
  currency: 'INR',
  taxPercent: 18,
  cancelFullRefundHours: 24,
  cancelPartialRefundHours: 2,
  cancelPartialRefundPercent: 50,
};

export async function getRegionConfig(regionCode = 'KL'): Promise<RegionConfigData> {
  try {
    const region = await prisma.region.findFirst({
      where: { code: regionCode },
      include: {
        configs: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
    });

    const config = region?.configs?.[0];
    if (!config) {
      return DEFAULT_CONFIG;
    }

    const hourlyBookingFee = typeof config.hourlyBookingFee === 'number' ? config.hourlyBookingFee : 399;
    const platformCommissionPercent =
      typeof config.platformCommissionPercent === 'number' ? config.platformCommissionPercent : 20;

    const supporterSharePercent = Math.max(0, parseFloat((100 - platformCommissionPercent).toFixed(2)));
    const supporterHourlyEarnings = parseFloat(
      ((hourlyBookingFee * supporterSharePercent) / 100).toFixed(2)
    );
    const platformHourlyFee = parseFloat(
      ((hourlyBookingFee * platformCommissionPercent) / 100).toFixed(2)
    );

    return {
      id: config.id,
      regionId: config.regionId,
      memberYearlyFee: config.memberYearlyFee ?? 199,
      supporterYearlyFee: config.supporterYearlyFee ?? 499,
      hourlyBookingFee,
      platformCommissionPercent,
      supporterSharePercent,
      supporterHourlyEarnings,
      platformHourlyFee,
      currency: config.currency || 'INR',
      taxPercent: config.taxPercent ?? 18,
      cancelFullRefundHours: config.cancelFullRefundHours ?? 24,
      cancelPartialRefundHours: config.cancelPartialRefundHours ?? 2,
      cancelPartialRefundPercent: config.cancelPartialRefundPercent ?? 50,
    };
  } catch (error) {
    console.error('Error fetching region config:', error);
    return DEFAULT_CONFIG;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  predictDepletionDate,
  detectMissingStaples,
  PurchaseRecord,
  HistoricalStapleProfile,
} from '@masik/business-rules';

@Injectable()
export class ConsumptionService {
  constructor(private prisma: PrismaService) {}

  async getConsumptionPredictions(householdId: string) {
    const orders = await this.prisma.client.order.findMany({
      where: { householdId },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });

    const records: PurchaseRecord[] = [];
    for (const order of orders) {
      for (const item of order.items) {
        records.push({
          variantId: item.variantId,
          productNameEn: item.productNameEn,
          productNameBn: item.productNameBn,
          quantity: item.quantity,
          purchasedAt: order.createdAt.toISOString(),
        });
      }
    }

    // If records are scarce (e.g. initial demo), provide intelligent defaults for common staples
    if (records.length < 2) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 28);

      return [
        {
          variantId: 'v-oil-rup-5l',
          productNameEn: 'Rupchanda Soybean Oil 5L',
          productNameBn: 'রূপচাঁদা সয়াবিন তেল ৫লিটার',
          avgCycleDays: 29,
          estimatedDepletionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isRunningLow: true,
          daysRemaining: 1,
        },
        {
          variantId: 'v-rice-chashi-25k',
          productNameEn: 'Chashi Miniket Rice 25kg',
          productNameBn: 'চাষী মিনিকেট চাল ২৫ কেজি',
          avgCycleDays: 32,
          estimatedDepletionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isRunningLow: true,
          daysRemaining: 4,
        },
      ];
    }

    return predictDepletionDate(records);
  }

  async checkMissingStaples(householdId: string, currentVariantIds: string[]) {
    // Defined high-frequency staples for Bangladesh
    const sampleHistoricalStaples: HistoricalStapleProfile[] = [
      {
        variantId: 'v-det-wheel-2k',
        nameEn: 'Wheel 2in1 Washing Powder 2kg',
        nameBn: 'হুইল ডিটারজেন্ট পাউডার ২ কেজি',
        category: 'পরিচ্ছন্নতা',
        unitMasikPrice: 330,
        unitMrp: 360,
        purchaseFrequencyPercent: 90,
        typicalQuantity: 1,
      },
      {
        variantId: 'v-salt-aci-1k',
        nameEn: 'ACI Pure Vacuum Salt 1kg',
        nameBn: 'এসিআই পিওর লবণ ১ কেজি',
        category: 'লবণ',
        unitMasikPrice: 38,
        unitMrp: 42,
        purchaseFrequencyPercent: 85,
        typicalQuantity: 2,
      },
      {
        variantId: 'v-soap-lifebuoy-4p',
        nameEn: 'Lifebuoy Total Soap Bar (Pack of 4)',
        nameBn: 'লাইফবয় সাবান ৪টি প্যাক',
        category: 'সাবান',
        unitMasikPrice: 218,
        unitMrp: 240,
        purchaseFrequencyPercent: 75,
        typicalQuantity: 1,
      },
    ];

    return detectMissingStaples(currentVariantIds, sampleHistoricalStaples);
  }
}

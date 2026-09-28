import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditTransactionType } from '@masik/shared-types';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async getCustomerCredits(customerId: string) {
    const profile = await this.prisma.client.customerProfile.findUnique({
      where: { id: customerId },
      include: {
        creditLedgers: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!profile) throw new NotFoundException('Customer profile not found');

    return {
      balance: profile.loyaltyCredits,
      referralCode: profile.referralCode,
      history: profile.creditLedgers,
    };
  }

  async earnCredits(
    customerId: string,
    amount: number,
    type: CreditTransactionType,
    referenceId?: string,
    note?: string
  ) {
    const profile = await this.prisma.client.customerProfile.findUnique({
      where: { id: customerId },
    });
    if (!profile) throw new NotFoundException('Customer profile not found');

    const newBalance = profile.loyaltyCredits + amount;

    await this.prisma.client.$transaction([
      this.prisma.client.customerProfile.update({
        where: { id: customerId },
        data: { loyaltyCredits: newBalance },
      }),
      this.prisma.client.marketCreditLedger.create({
        data: {
          customerId,
          amount,
          balanceAfter: newBalance,
          type,
          referenceId,
          note: note || `Credited ৳${amount} (${type})`,
        },
      }),
    ]);

    return {
      success: true,
      creditedAmount: amount,
      newBalance,
    };
  }

  async redeemCredits(customerId: string, amount: number, orderId: string) {
    const profile = await this.prisma.client.customerProfile.findUnique({
      where: { id: customerId },
    });
    if (!profile) throw new NotFoundException('Customer profile not found');

    if (profile.loyaltyCredits < amount) {
      throw new BadRequestException(
        `Insufficient Market Credits. Available: ৳${profile.loyaltyCredits}, Requested: ৳${amount}`
      );
    }

    const newBalance = profile.loyaltyCredits - amount;

    await this.prisma.client.$transaction([
      this.prisma.client.customerProfile.update({
        where: { id: customerId },
        data: { loyaltyCredits: newBalance },
      }),
      this.prisma.client.marketCreditLedger.create({
        data: {
          customerId,
          amount: -amount,
          balanceAfter: newBalance,
          type: CreditTransactionType.ORDER_REDEMPTION,
          referenceId: orderId,
          note: `Redeemed on Order ${orderId}`,
        },
      }),
    ]);

    return {
      success: true,
      redeemedAmount: amount,
      remainingBalance: newBalance,
    };
  }

  async getReferralSummary(customerId: string) {
    const profile = await this.prisma.client.customerProfile.findUnique({
      where: { id: customerId },
      include: {
        user: true,
      },
    });
    if (!profile) throw new NotFoundException('Customer profile not found');

    // Count customers referred by this user
    const referredProfiles = await this.prisma.client.customerProfile.findMany({
      where: { referredById: customerId },
    });

    const totalReferred = referredProfiles.length;
    // Calculate total referral bonus credits earned from ledger
    const referralCredits = await this.prisma.client.marketCreditLedger.aggregate({
      where: {
        customerId,
        type: CreditTransactionType.REFERRAL_BONUS,
      },
      _sum: { amount: true },
    });

    return {
      referralCode: profile.referralCode,
      referralLink: `https://masherbazar.com/join?ref=${profile.referralCode}`,
      friendsReferred: totalReferred,
      successfulOrders: totalReferred,
      creditsEarned: referralCredits._sum.amount || (totalReferred * 200),
      sharePromptBn: `মাসের বাজার-এ যোগ দিয়ে আমার রেফারাল কোড ${profile.referralCode} ব্যবহার করুন এবং আপনার প্রথম মাসের বাজারে পাবেন ৳১০০ ডিসকাউন্ট!`,
    };
  }
}

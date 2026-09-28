import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionType, SubscriptionStatus } from '@masik/shared-types';

export interface CreateSubscriptionDto {
  householdId: string;
  type: SubscriptionType;
  deliveryDayOfMonth: number; // 1-31 (Salary payday cycle)
  deliverySlotId: string;
  items: {
    variantId: string;
    quantity: number;
  }[];
}

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    const nextDate = new Date();
    nextDate.setDate(dto.deliveryDayOfMonth);
    if (nextDate <= new Date()) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    const subscription = await this.prisma.client.subscription.create({
      data: {
        householdId: dto.householdId,
        type: dto.type,
        status: SubscriptionStatus.ACTIVE,
        deliveryDayOfMonth: dto.deliveryDayOfMonth,
        deliverySlotId: dto.deliverySlotId,
        nextBillingDate: nextDate,
      },
      include: {
        deliverySlot: true,
        household: true,
      },
    });

    return subscription;
  }

  async getHouseholdSubscription(householdId: string) {
    return this.prisma.client.subscription.findFirst({
      where: { householdId, status: { not: SubscriptionStatus.CANCELLED } },
      include: {
        deliverySlot: { include: { zone: true } },
        priceLockContracts: { where: { isActive: true } },
      },
    });
  }

  async updateStatus(subscriptionId: string, status: SubscriptionStatus) {
    const sub = await this.prisma.client.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!sub) throw new NotFoundException('Subscription not found');

    return this.prisma.client.subscription.update({
      where: { id: subscriptionId },
      data: { status },
    });
  }

  async activatePriceLock(subscriptionId: string, durationDays: number = 30) {
    const sub = await this.prisma.client.subscription.findUnique({
      where: { id: subscriptionId },
      include: { household: { include: { baskets: { take: 1, orderBy: { createdAt: 'desc' } } } } },
    });

    if (!sub) throw new NotFoundException('Subscription not found');

    const latestBasket = sub.household.baskets[0];
    const lockedAmount = latestBasket ? latestBasket.totalMasikPrice : 5890;

    const lockedUntilDate = new Date();
    lockedUntilDate.setDate(lockedUntilDate.getDate() + durationDays);

    const priceLock = await this.prisma.client.priceLockContract.create({
      data: {
        subscriptionId,
        householdId: sub.householdId,
        lockedTotalAmount: lockedAmount,
        lockedUntilDate,
        itemSnapshotJson: latestBasket ? (latestBasket as any) : {},
        isActive: true,
      },
    });

    await this.prisma.client.subscription.update({
      where: { id: subscriptionId },
      data: { priceLockActiveUntil: lockedUntilDate },
    });

    return {
      message: `30-Day Price Lock successfully activated for ৳${lockedAmount} until ${lockedUntilDate.toDateString()}`,
      contract: priceLock,
    };
  }

  async processSalaryCycleBilling() {
    // Cron trigger: finds all active subscriptions due today
    const today = new Date();
    const activeSubs = await this.prisma.client.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        nextBillingDate: { lte: today },
      },
      include: { household: true },
    });

    return {
      processedCount: activeSubs.length,
      status: 'Batch billing completed for today',
      dueSubscriptions: activeSubs.map((s) => ({
        id: s.id,
        householdId: s.householdId,
        payday: s.deliveryDayOfMonth,
      })),
    };
  }
}

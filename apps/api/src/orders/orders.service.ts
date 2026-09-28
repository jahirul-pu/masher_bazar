import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@masik/shared-types';

export interface CreateOrderDto {
  householdId: string;
  addressId: string;
  deliverySlotId: string;
  deliveryDate: string; // ISO date
  paymentMethod: PaymentMethod;
  items: {
    variantId: string;
    quantity: number;
  }[];
  creditsToRedeem?: number;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getDeliveryZones() {
    return this.prisma.client.deliveryZone.findMany({
      where: { isActive: true },
      include: {
        slots: {
          where: { isActive: true },
          orderBy: { startTime: 'asc' },
        },
      },
    });
  }

  async createOrder(dto: CreateOrderDto) {
    const slot = await this.prisma.client.deliverySlot.findUnique({
      where: { id: dto.deliverySlotId },
      include: { zone: true },
    });

    if (!slot) {
      throw new BadRequestException('Selected delivery slot does not exist');
    }

    // Verify slot capacity for deliveryDate
    const existingOrdersCount = await this.prisma.client.order.count({
      where: {
        deliverySlotId: dto.deliverySlotId,
        deliveryDate: new Date(dto.deliveryDate),
        status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] },
      },
    });

    if (existingOrdersCount >= slot.maxOrdersPerDay) {
      throw new BadRequestException('Selected delivery slot is fully booked for this date. Please select another slot.');
    }

    // Fetch variant prices and names
    const variantIds = dto.items.map((i) => i.variantId);
    const variants = await this.prisma.client.productVariant.findMany({
      where: { id: { in: variantIds } },
    });
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    let subtotal = 0;
    let totalMrp = 0;
    const orderItemsData = dto.items.map((item) => {
      const v = variantMap.get(item.variantId);
      if (!v) throw new BadRequestException(`Variant ${item.variantId} not found`);

      const lineTotal = v.masikPrice * item.quantity;
      const lineMrp = v.mrp * item.quantity;
      const lineSavings = lineMrp - lineTotal;

      subtotal += lineTotal;
      totalMrp += lineMrp;

      return {
        variantId: item.variantId,
        productNameEn: v.nameEn,
        productNameBn: v.nameBn,
        quantity: item.quantity,
        unitPrice: v.masikPrice,
        referenceMrp: v.mrp,
        totalPrice: lineTotal,
        totalSavings: lineSavings,
      };
    });

    const deliveryFee = subtotal >= slot.zone.minOrderAmount ? 0 : slot.zone.baseDeliveryFee;
    const creditsUsed = dto.creditsToRedeem || 0;
    const grandTotal = Math.max(0, subtotal + deliveryFee - creditsUsed);
    const totalSavings = totalMrp - subtotal;

    const orderNumber = `MB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await this.prisma.client.order.create({
      data: {
        orderNumber,
        householdId: dto.householdId,
        addressId: dto.addressId,
        status: OrderStatus.PLACED,
        subtotal,
        deliveryFee,
        discount: 0,
        creditsUsed,
        grandTotal,
        totalSavings,
        paymentMethod: dto.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        deliverySlotId: dto.deliverySlotId,
        deliveryDate: new Date(dto.deliveryDate),
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            status: OrderStatus.PLACED,
            note: 'Order placed successfully by customer',
          },
        },
      },
      include: {
        items: true,
        deliverySlot: { include: { zone: true } },
        address: true,
      },
    });

    return order;
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
        deliverySlot: { include: { zone: true } },
        address: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    return order;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string) {
    const order = await this.getOrderById(orderId);

    const updated = await this.prisma.client.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        statusHistory: {
          create: {
            status: newStatus,
            note: note || `Status updated to ${newStatus}`,
          },
        },
      },
      include: {
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    return updated;
  }

  async getHouseholdOrders(householdId: string) {
    return this.prisma.client.order.findMany({
      where: { householdId },
      include: {
        items: true,
        deliverySlot: { include: { zone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PickingBatchStatus } from '@masik/shared-types';

@Injectable()
export class WmsService {
  constructor(private prisma: PrismaService) {}

  async generateWavePickingBatch(warehouseId: string, deliverySlotId: string, deliveryDateStr: string) {
    const deliveryDate = new Date(deliveryDateStr);

    const orders = await this.prisma.client.order.findMany({
      where: {
        deliverySlotId,
        deliveryDate,
        status: { in: [OrderStatus.CONFIRMED, OrderStatus.PAID] },
      },
      include: {
        items: true,
      },
    });

    if (orders.length === 0) {
      throw new BadRequestException('No confirmed orders found for this delivery slot and date to generate a batch.');
    }

    // Aggregate items across all orders
    const itemMap = new Map<string, { variantId: string; productNameEn: string; totalQty: number }>();
    for (const order of orders) {
      for (const item of order.items) {
        const existing = itemMap.get(item.variantId);
        if (existing) {
          existing.totalQty += item.quantity;
        } else {
          itemMap.set(item.variantId, {
            variantId: item.variantId,
            productNameEn: item.productNameEn,
            totalQty: item.quantity,
          });
        }
      }
    }

    const aggregatedList = Array.from(itemMap.values()).map((i) => ({
      variantId: i.variantId,
      productNameEn: i.productNameEn,
      totalRequiredQty: i.totalQty,
      pickedQty: 0,
      locationBin: 'AISLE-A1-BIN',
    }));

    const batchCode = `WAVE-${Date.now().toString().slice(-6)}`;

    const batch = await this.prisma.client.pickingBatch.create({
      data: {
        batchCode,
        warehouseId,
        deliverySlotId,
        deliveryDate,
        status: PickingBatchStatus.GENERATED,
        manifestJson: aggregatedList as any,
      },
      include: {
        warehouse: true,
        deliverySlot: true,
      },
    });

    // Update orders to PICKING
    const orderIds = orders.map((o) => o.id);
    await this.prisma.client.order.updateMany({
      where: { id: { in: orderIds } },
      data: { status: OrderStatus.PICKING },
    });

    return {
      batch,
      aggregatedSummary: aggregatedList,
      totalOrdersGrouped: orders.length,
    };
  }

  async getPickingBatches(warehouseId: string) {
    return this.prisma.client.pickingBatch.findMany({
      where: { warehouseId },
      include: { deliverySlot: { include: { zone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getInventoryBatches(warehouseId: string) {
    return this.prisma.client.inventoryBatch.findMany({
      where: { warehouseId },
      include: {
        variant: { include: { product: { include: { category: true } } } },
      },
      orderBy: { physicalStock: 'asc' },
    });
  }
}

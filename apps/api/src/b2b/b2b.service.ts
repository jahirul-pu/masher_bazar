import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RegisterB2BDto {
  companyName: string;
  binNumber: string;
  contactPerson: string;
  contactPhone: string;
  creditLimit?: number; // default 50000
  paymentCycleDays?: number; // default 30 (Net 30)
}

export interface CreateB2BOrderDto {
  b2bAccountId: string;
  deliveryAddress: string;
  items: {
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
}

@Injectable()
export class B2BService {
  constructor(private prisma: PrismaService) {}

  async registerAccount(dto: RegisterB2BDto) {
    const existing = await this.prisma.client.b2BAccount.findUnique({
      where: { binNumber: dto.binNumber },
    });
    if (existing) {
      throw new BadRequestException(`A B2B account with BIN/TIN ${dto.binNumber} already exists`);
    }

    const account = await this.prisma.client.b2BAccount.create({
      data: {
        companyName: dto.companyName,
        binNumber: dto.binNumber,
        contactPerson: dto.contactPerson,
        contactPhone: dto.contactPhone,
        creditLimit: dto.creditLimit || 50000,
        currentCreditUsed: 0,
        paymentCycleDays: dto.paymentCycleDays || 30,
        isActive: true,
      },
    });

    return account;
  }

  async getAccount(id: string) {
    const account = await this.prisma.client.b2BAccount.findUnique({
      where: { id },
    });
    if (!account) throw new NotFoundException('B2B account not found');

    const availableCredit = account.creditLimit - account.currentCreditUsed;

    return {
      account,
      availableCredit,
      isCreditHealthy: availableCredit > 0,
    };
  }

  async createB2BOrder(dto: CreateB2BOrderDto) {
    const account = await this.prisma.client.b2BAccount.findUnique({
      where: { id: dto.b2bAccountId },
    });
    if (!account) throw new NotFoundException('B2B account not found');

    const subtotal = dto.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    const vatAmount = Math.round(subtotal * 0.05); // 5% VAT in Bangladesh
    const invoiceTotal = subtotal + vatAmount;

    // Check credit limit
    if (account.currentCreditUsed + invoiceTotal > account.creditLimit) {
      throw new BadRequestException(
        `Order exceeds approved corporate credit limit. Total: ৳${invoiceTotal}, Available Credit: ৳${account.creditLimit - account.currentCreditUsed}`
      );
    }

    const invoiceNumber = `INV-B2B-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + account.paymentCycleDays);

    // Update used credit
    await this.prisma.client.b2BAccount.update({
      where: { id: account.id },
      data: { currentCreditUsed: account.currentCreditUsed + invoiceTotal },
    });

    return {
      invoiceNumber,
      companyName: account.companyName,
      binNumber: account.binNumber,
      deliveryAddress: dto.deliveryAddress,
      subtotal,
      vat5Percent: vatAmount,
      invoiceTotal,
      paymentTerms: `Net ${account.paymentCycleDays}`,
      paymentDueDate: dueDate.toISOString().split('T')[0],
      items: dto.items,
      status: 'ISSUED',
    };
  }

  async getInvoices(accountId: string) {
    // Generate simulated billing history for B2B account
    const account = await this.prisma.client.b2BAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException('B2B account not found');

    return [
      {
        invoiceNumber: 'INV-B2B-2026-0812',
        month: 'September 2026',
        itemsCount: 18,
        totalAmount: 42500,
        status: 'PAID',
        paidAt: '2026-09-15',
      },
      {
        invoiceNumber: 'INV-B2B-2026-0924',
        month: 'October 2026',
        itemsCount: 22,
        totalAmount: 48900,
        status: 'PENDING_PAYMENT',
        dueDate: '2026-10-25',
      },
    ];
  }
}

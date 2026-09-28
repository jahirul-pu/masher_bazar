import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  MockBkashAdapter,
  MockNagadAdapter,
  MockSslCommerzAdapter,
} from '@masik/mock-adapters';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@masik/shared-types';

@Injectable()
export class PaymentsService {
  private bkash = new MockBkashAdapter();
  private nagad = new MockNagadAdapter();
  private sslCommerz = new MockSslCommerzAdapter();

  constructor(private prisma: PrismaService) {}

  async initiatePayment(orderId: string, method: PaymentMethod) {
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
      include: { household: { include: { customer: { include: { user: true } } } } },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const user = order.household.customer.user;

    switch (method) {
      case PaymentMethod.BKASH: {
        const agreement = await this.bkash.createAgreement(user.phone);
        const payment = await this.bkash.createPaymentWithAgreement(
          agreement.agreementId,
          order.grandTotal,
          order.orderNumber
        );

        // Auto-complete in sandbox mode
        await this.prisma.client.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: PaymentStatus.SUCCESS,
            status: OrderStatus.CONFIRMED,
            paymentMethod: PaymentMethod.BKASH,
          },
        });

        return {
          paymentUrl: agreement.paymentUrl,
          paymentId: payment.paymentId,
          trxId: payment.trxId,
          status: 'SUCCESS',
          message: 'bKash payment completed successfully via tokenized agreement',
        };
      }

      case PaymentMethod.NAGAD: {
        const nagadRes = await this.nagad.initiatePayment(orderId, order.grandTotal);
        await this.prisma.client.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: PaymentStatus.SUCCESS,
            status: OrderStatus.CONFIRMED,
            paymentMethod: PaymentMethod.NAGAD,
          },
        });
        return nagadRes;
      }

      case PaymentMethod.CARD_SSLCOMMERZ: {
        const sslRes = await this.sslCommerz.initiateSession(
          orderId,
          order.grandTotal,
          user.fullName,
          user.phone
        );
        return sslRes;
      }

      case PaymentMethod.COD: {
        await this.prisma.client.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: PaymentStatus.PENDING,
            status: OrderStatus.CONFIRMED,
            paymentMethod: PaymentMethod.COD,
          },
        });
        return {
          status: 'CONFIRMED',
          message: 'Cash on Delivery confirmed. Payment to be collected upon physical delivery.',
        };
      }

      default:
        throw new BadRequestException(`Unsupported payment method: ${method}`);
    }
  }
}

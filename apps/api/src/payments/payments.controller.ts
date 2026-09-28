import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PaymentMethod } from '@masik/shared-types';

export class InitiatePaymentDto {
  method!: PaymentMethod;
}

@ApiTags('Bangladesh Payments Engine')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post(':orderId/initiate')
  @ApiOperation({ summary: 'Initiate payment (bKash Tokenized, Nagad, SSLCommerz, COD)' })
  async initiatePayment(@Param('orderId') orderId: string, @Body() body: InitiatePaymentDto) {
    return this.paymentsService.initiatePayment(orderId, body.method);
  }
}

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoyaltyService } from './loyalty.service';

export class RedeemCreditsDto {
  amount!: number;
  orderId!: string;
}

@ApiTags('Market Credits & Viral Referrals')
@Controller('loyalty')
export class LoyaltyController {
  constructor(private loyaltyService: LoyaltyService) {}

  @Get('customer/:customerId/credits')
  @ApiOperation({ summary: 'Get current customer Market Credits balance and full ledger history (Section 47 PRD)' })
  async getCredits(@Param('customerId') customerId: string) {
    return this.loyaltyService.getCustomerCredits(customerId);
  }

  @Post('customer/:customerId/redeem')
  @ApiOperation({ summary: 'Redeem Market Credits against an order' })
  async redeemCredits(@Param('customerId') customerId: string, @Body() body: RedeemCreditsDto) {
    return this.loyaltyService.redeemCredits(customerId, body.amount, body.orderId);
  }

  @Get('customer/:customerId/referrals')
  @ApiOperation({ summary: 'Get referral metrics, code and credit earnings (Section 48 PRD)' })
  async getReferrals(@Param('customerId') customerId: string) {
    return this.loyaltyService.getReferralSummary(customerId);
  }
}

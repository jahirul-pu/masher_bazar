import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubscriptionsService, CreateSubscriptionDto } from './subscriptions.service';
import { SubscriptionStatus } from '@masik/shared-types';

export class UpdateSubscriptionStatusDto {
  status!: SubscriptionStatus;
}

@ApiTags('Subscription & Salary-Cycle Engine')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recurring monthly grocery subscription' })
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(dto);
  }

  @Get('household/:householdId')
  @ApiOperation({ summary: 'Get active subscription for a household' })
  async getHouseholdSubscription(@Param('householdId') householdId: string) {
    return this.subscriptionsService.getHouseholdSubscription(householdId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Pause, resume, skip, or cancel subscription' })
  async updateStatus(@Param('id') id: string, @Body() body: UpdateSubscriptionStatusDto) {
    return this.subscriptionsService.updateStatus(id, body.status);
  }

  @Post(':id/price-lock')
  @ApiOperation({ summary: 'Activate 30-day commodity price lock' })
  async activatePriceLock(@Param('id') id: string) {
    return this.subscriptionsService.activatePriceLock(id);
  }

  @Post('trigger-salary-cycle-cron')
  @ApiOperation({ summary: 'Manually trigger daily salary-cycle billing execution (Worker simulation)' })
  async triggerSalaryCycle() {
    return this.subscriptionsService.processSalaryCycleBilling();
  }
}

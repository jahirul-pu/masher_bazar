import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConsumptionService } from './consumption.service';

export class CheckMissingStaplesDto {
  currentVariantIds!: string[];
}

@ApiTags('Consumption & Pantry Depletion Prediction')
@Controller('consumption')
export class ConsumptionController {
  constructor(private consumptionService: ConsumptionService) {}

  @Get('household/:householdId/predictions')
  @ApiOperation({ summary: 'Predict household staple depletion dates and stock-out alerts (Section 22 PRD)' })
  async getPredictions(@Param('householdId') householdId: string) {
    return this.consumptionService.getConsumptionPredictions(householdId);
  }

  @Post('household/:householdId/check-missing-items')
  @ApiOperation({ summary: 'Detect omitted historical staples from current draft basket (Section 21 PRD)' })
  async checkMissing(@Param('householdId') householdId: string, @Body() body: CheckMissingStaplesDto) {
    return this.consumptionService.checkMissingStaples(householdId, body.currentVariantIds || []);
  }
}

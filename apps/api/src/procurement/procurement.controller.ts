import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProcurementService, CreatePurchaseOrderDto, ValidateMarginDto } from './procurement.service';

@ApiTags('Procurement & Margin Protection')
@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get('suppliers')
  @ApiOperation({ summary: 'Get list of active wholesale suppliers & distributors' })
  getSuppliers() {
    return this.procurementService.getSuppliers();
  }

  @Get('forecast-demand')
  @ApiOperation({ summary: 'Forecast next 14-day aggregated bulk staple demand from active subscriptions' })
  getForecastDemand(@Query('days') days?: number) {
    return this.procurementService.getForecastDemand(days ? Number(days) : 14);
  }

  @Post('purchase-orders')
  @ApiOperation({ summary: 'Generate and issue purchase order to distributor' })
  createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto) {
    return this.procurementService.createPurchaseOrder(dto);
  }

  @Get('purchase-orders')
  @ApiOperation({ summary: 'List all issued and drafted purchase orders' })
  getPurchaseOrders() {
    return this.procurementService.getPurchaseOrders();
  }

  @Post('validate-margin')
  @ApiOperation({ summary: 'Margin Protection Validator: Ensures selling price respects margin floors (Section 35 PRD)' })
  validateMargin(@Body() dto: ValidateMarginDto) {
    return this.procurementService.validateProductMargin(dto);
  }
}

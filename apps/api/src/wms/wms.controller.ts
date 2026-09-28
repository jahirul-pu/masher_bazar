import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WmsService } from './wms.service';

export class GenerateWaveDto {
  warehouseId!: string;
  deliverySlotId!: string;
  deliveryDate!: string;
}

@ApiTags('Warehouse Management (WMS)')
@Controller('wms')
export class WmsController {
  constructor(private wmsService: WmsService) {}

  @Post('waves/generate')
  @ApiOperation({ summary: 'Generate a bulk wave picking batch for a delivery slot' })
  async generateWave(@Body() body: GenerateWaveDto) {
    return this.wmsService.generateWavePickingBatch(body.warehouseId, body.deliverySlotId, body.deliveryDate);
  }

  @Get('warehouses/:warehouseId/waves')
  @ApiOperation({ summary: 'List picking batches in a warehouse' })
  async getWaves(@Param('warehouseId') warehouseId: string) {
    return this.wmsService.getPickingBatches(warehouseId);
  }

  @Get('warehouses/:warehouseId/inventory')
  @ApiOperation({ summary: 'Get physical and reserved inventory stock by warehouse' })
  async getInventory(@Param('warehouseId') warehouseId: string) {
    return this.wmsService.getInventoryBatches(warehouseId);
  }
}

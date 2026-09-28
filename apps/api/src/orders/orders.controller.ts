import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService, CreateOrderDto } from './orders.service';
import { OrderStatus } from '@masik/shared-types';

export class UpdateOrderStatusDto {
  status!: OrderStatus;
  note?: string;
}

@ApiTags('Orders & Logistics')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('zones')
  @ApiOperation({ summary: 'Get Dhaka delivery zones and time slots with capacities' })
  async getDeliveryZones() {
    return this.ordersService.getDeliveryZones();
  }

  @Post()
  @ApiOperation({ summary: 'Place a new monthly grocery order' })
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details and full tracking state history' })
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Transition order status (Operations / Rider update)' })
  async updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, body.status, body.note);
  }

  @Get('household/:householdId')
  @ApiOperation({ summary: 'Get all historical orders for a household' })
  async getHouseholdOrders(@Param('householdId') householdId: string) {
    return this.ordersService.getHouseholdOrders(householdId);
  }
}

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { B2BService, RegisterB2BDto, CreateB2BOrderDto } from './b2b.service';

@ApiTags('B2B Corporate, Mess & Hostel Module')
@Controller('b2b')
export class B2BController {
  constructor(private b2bService: B2BService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register an Office, Hostel, Mess, or Restaurant account with credit terms (Section 49 PRD)' })
  async registerAccount(@Body() dto: RegisterB2BDto) {
    return this.b2bService.registerAccount(dto);
  }

  @Get('account/:id')
  @ApiOperation({ summary: 'Get B2B account details and available corporate credit limit' })
  async getAccount(@Param('id') id: string) {
    return this.b2bService.getAccount(id);
  }

  @Post('orders')
  @ApiOperation({ summary: 'Place a B2B bulk recurring order with monthly VAT invoice' })
  async createB2BOrder(@Body() dto: CreateB2BOrderDto) {
    return this.b2bService.createB2BOrder(dto);
  }

  @Get('account/:id/invoices')
  @ApiOperation({ summary: 'Get monthly corporate VAT invoices' })
  async getInvoices(@Param('id') id: string) {
    return this.b2bService.getInvoices(id);
  }
}

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BasketService, GenerateBasketDto, OptimizeBasketDto } from './basket.service';

@ApiTags('Monthly Basket Engine')
@Controller('baskets')
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate recommended monthly grocery basket based on household demographics' })
  async generateBasket(@Body() dto: GenerateBasketDto) {
    return this.basketService.generateBasket(dto);
  }

  @Post('optimize')
  @ApiOperation({ summary: 'Optimize basket items to fit customer target budget via smart product substitutions' })
  async optimizeBasket(@Body() dto: OptimizeBasketDto) {
    return this.basketService.optimizeBasket(dto);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { BasketModule } from './basket/basket.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { WmsModule } from './wms/wms.module';
import { AiModule } from './ai/ai.module';
import { ConsumptionModule } from './consumption/consumption.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { B2BModule } from './b2b/b2b.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    BasketModule,
    OrdersModule,
    PaymentsModule,
    SubscriptionsModule,
    WmsModule,
    AiModule,
    ConsumptionModule,
    LoyaltyModule,
    B2BModule,
  ],
})
export class AppModule {}

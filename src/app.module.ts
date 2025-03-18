import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DishesModule } from './dishes/dishes.module';
import { CartModule } from './cart/cart.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    UsersModule,
    OrdersModule,
    AuthModule,
    DishesModule,
    CartModule,
    RestaurantsModule,
  ],
})
export class AppModule {}
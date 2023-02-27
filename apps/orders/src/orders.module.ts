import { RmqModule } from '../../../libs/rmq/src/rmq.module';
import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { BILLING_SERVICE } from './constants/service.constant';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { Order, OrderSchema } from './schemas/orders.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),

    // Connect to the BILLING queue as a producer
    RmqModule.register({ serviceName: BILLING_SERVICE }),

    //import database and mongoose module
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}

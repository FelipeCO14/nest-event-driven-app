import { RmqModule } from '../../../libs/rmq/src/rmq.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDERS_SERVICE } from './constants/service.constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/billing/.env',
    }),

    // Connect to the Fraud service through TCP
    ClientsModule.registerAsync([
      {
        name: 'FRAUD',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: 'fraud',
            port: configService.get<number>('FRAUD_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),

    // Connect to the ORDERS_UPDATE queue as a producer
    RmqModule.register({ serviceName: ORDERS_SERVICE }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}

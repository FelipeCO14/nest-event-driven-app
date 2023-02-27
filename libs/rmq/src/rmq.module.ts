import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  serviceName;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ serviceName }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        /* 
          Creates a dynamic module based on the serviceName
          This module creates/connects to a queue as an event producer
        */
        ClientsModule.registerAsync([
          {
            name: serviceName,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URI')],
                queue: configService.get<string>(
                  `RABBIT_MQ_${serviceName}_QUEUE`,
                ),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}

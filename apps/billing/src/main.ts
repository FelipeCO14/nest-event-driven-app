import { NestFactory } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { RmqService } from '../../../libs/rmq/src/rmq.service';

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get<RmqService>(RmqService);

  // Subscribe to the BILLING queue as a consumer
  app.connectMicroservice(rmqService.getOptions('RABBIT_MQ_BILLING_QUEUE'));
  await app.startAllMicroservices();
}
bootstrap();

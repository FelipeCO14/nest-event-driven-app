import { RmqService } from '../../../libs/rmq/src/rmq.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './orders.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('ORDERS_PORT');
  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);

  // Subscribe to ORDERS_UPDATE queue as a consumer
  app.connectMicroservice(
    rmqService.getOptions('RABBIT_MQ_ORDERS_UPDATE_QUEUE'),
  );
  app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();

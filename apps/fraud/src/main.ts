import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { FraudModule } from './fraud.module';

async function bootstrap() {
  const app = await NestFactory.create(FraudModule);
  const configService = app.get(ConfigService);
  const port = configService.get('FRAUD_PORT');

  // TCP accesible microservice (not accesible with HTTP rest from outside)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'fraud',
      port: port,
    },
  });
  app.startAllMicroservices();
}
bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FraudController } from './fraud.controller';
import { FraudService } from './fraud.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
  ],
  controllers: [FraudController],
  providers: [FraudService],
})
export class FraudModule {}

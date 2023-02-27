import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FraudService } from './fraud.service';
import { Order } from './types/order.type';

@Controller()
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  @MessagePattern({ cmd: 'check_fraud' })
  checkFraud(@Payload() data: Order): boolean {
    console.log('checking for fraud...');
    return this.fraudService.checkFraud(data);
  }
}

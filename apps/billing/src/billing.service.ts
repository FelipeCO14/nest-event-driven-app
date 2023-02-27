import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Order } from './types/order.type';

@Injectable()
export class BillingService {
  constructor(@Inject('FRAUD') private readonly fraudClient: ClientProxy) {}

  async bill(data: Order) {
    // dummy billing
    console.log('Billing order', data);
  }

  async isFraud(data: Order): Promise<boolean> {
    const isFraud: boolean = await lastValueFrom(
      this.fraudClient.send({ cmd: 'check_fraud' }, data),
    );

    return isFraud;
  }
}

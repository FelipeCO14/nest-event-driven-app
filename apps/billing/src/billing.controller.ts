import { RmqService } from '../../../libs/rmq/src/rmq.service';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { BillingService } from './billing.service';
import { ORDERS_SERVICE } from './constants/service.constant';
import { lastValueFrom } from 'rxjs';
import { Order } from './types/order.type';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly rmqService: RmqService,
    @Inject(ORDERS_SERVICE) private ordersClient: ClientProxy,
  ) {}

  @EventPattern('order_created')
  async handleOrderCreated(
    @Payload('orderPayload') order: Order,
    @Ctx() context: RmqContext,
  ) {
    //check for fraud
    if (await this.billingService.isFraud(order)) {
      console.log('cannot be billed because of fraud');
      order.status = 'CANCELED_FRAUD';
    } else {
      this.billingService.bill(order);
      order.status = 'PROCCESSED';
    }

    // emit and event to update the order status
    await lastValueFrom(
      this.ordersClient.emit('order_proccesed', {
        order,
      }),
    );
    console.log('order_processed event emitted', order);

    // if no errors happened, acknowledge the order_created proccess is over and remove it from the queue
    this.rmqService.ack(context);
    console.log('order_created event message acknoledged');
  }
}

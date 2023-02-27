import { RmqService } from '../../../libs/rmq/src/rmq.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateOrderRequest } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { OrderInterface } from './types/order.type';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  async createOrder(@Body() createOrderRequest: CreateOrderRequest) {
    return await this.ordersService.createOrder(createOrderRequest);
  }

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  getOrdersById(@Param('id') id: number) {
    return this.ordersService.getOrderById(id);
  }

  @EventPattern('order_proccesed')
  handleChangeOrderStatus(
    @Payload('order') order: OrderInterface,
    @Ctx() context: RmqContext,
  ) {
    const { orderId, status } = order;
    this.ordersService.updateOrderStatus(orderId, status);

    this.rmqService.ack(context);
    console.log('order_proccessed event message acknoledged');
  }
}

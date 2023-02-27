import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BILLING_SERVICE } from './constants/service.constant';
import { CreateOrderRequest } from './dto/create-order.dto';
import { lastValueFrom } from 'rxjs';
import { OrderInterface } from './types/order.type';
import { Order, OrderDocument } from './schemas/orders.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}
  async getOrders(): Promise<Order[]> {
    try {
      return await this.orderModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async createOrder(
    createOrderRequest: CreateOrderRequest,
  ): Promise<OrderInterface> {
    try {
      const order = new this.orderModel({
        ...createOrderRequest,
        status: 'PENDING',
      });

      await order.save();
      const orderPayload: OrderInterface = {
        orderId: order._id.toString(),
        productName: order.productName,
        price: order.price,
        buyer: order.buyer,
        status: order.status,
      };
      console.log('Order saved', orderPayload);

      await lastValueFrom(
        this.billingClient.emit('order_created', {
          orderPayload,
        }),
      );
      console.log('order_created event emitted');

      return orderPayload;
    } catch (error) {
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    try {
      const filter = { _id: orderId };
      const update = { status: status };
      return this.orderModel.findOneAndUpdate(filter, update);
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(orderId: number): Promise<Order> {
    try {
      return await this.orderModel.findById(orderId).exec();
    } catch (error) {
      throw error;
    }
  }
}

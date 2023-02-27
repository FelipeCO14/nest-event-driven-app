import { AbstractDocument } from './abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ versionKey: false })
export class Order extends AbstractDocument {
  @Prop()
  productName: string;

  @Prop()
  price: number;

  @Prop()
  buyer: string;

  @Prop()
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

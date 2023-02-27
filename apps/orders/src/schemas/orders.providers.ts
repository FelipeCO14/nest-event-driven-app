import { Connection } from 'mongoose';
import { OrderSchema } from './orders.schema';

export const ordersProvider = [
  {
    provide: 'CAT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];

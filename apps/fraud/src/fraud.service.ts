import { Injectable } from '@nestjs/common';
import { Order } from './types/order.type';

@Injectable()
export class FraudService {
  checkFraud(data: Order) {
    const { productName } = data;

    // Not a fraud (Dummy logic to simmulate fraud detection)
    if (['shirt', 'pants'].includes(productName)) {
      return false;
    } else {
      // fraud
      return true;
    }
  }
}

import { Injectable } from '@nestjs/common';
import OrderReadOnlyPort from '../../application/ports/order-read.port';

@Injectable()
export class OrderReadOnlyAdapter implements OrderReadOnlyPort {
    // Placeholder for future integrations
    async findById(): Promise<unknown> {
        return null;
    }
}

export default OrderReadOnlyAdapter;

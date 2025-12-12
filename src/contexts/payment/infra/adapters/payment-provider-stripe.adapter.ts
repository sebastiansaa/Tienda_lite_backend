import { Injectable } from '@nestjs/common';
import PaymentProviderPort, { PaymentProviderResult, PaymentProviderConfirmInput, PaymentProviderFailInput, PaymentProviderInitInput } from '../../application/ports/payment-provider.port';

@Injectable()
export class PaymentProviderStripeAdapter implements PaymentProviderPort {
    async initiatePayment(_input: PaymentProviderInitInput): Promise<PaymentProviderResult> {
        throw new Error('Stripe provider not implemented');
    }

    async confirmPayment(_input: PaymentProviderConfirmInput): Promise<PaymentProviderResult> {
        throw new Error('Stripe provider not implemented');
    }

    async failPayment(_input: PaymentProviderFailInput): Promise<PaymentProviderResult> {
        throw new Error('Stripe provider not implemented');
    }
}

export default PaymentProviderStripeAdapter;

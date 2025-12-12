import { InitiatePaymentDto, PaymentResponseDto } from '../dtos';
import InitiatePaymentCommand from '../../application/commands/initiate-payment.command';
import ConfirmPaymentCommand from '../../application/commands/confirm-payment.command';
import FailPaymentCommand from '../../application/commands/fail-payment.command';
import GetPaymentByIdQuery from '../../application/queries/get-payment-by-id.query';
import ListPaymentsForUserQuery from '../../application/queries/list-payments-for-user.query';
import { PaymentEntity } from '../../domain/entity/payment.entity';

export class PaymentApiMapper {
    static toInitiateCommand(dto: InitiatePaymentDto, userId: string): InitiatePaymentCommand {
        return new InitiatePaymentCommand(dto.orderId, dto.amount, userId);
    }

    static toConfirmCommand(paymentId: string, userId: string): ConfirmPaymentCommand {
        return new ConfirmPaymentCommand(paymentId, userId);
    }

    static toFailCommand(paymentId: string, userId: string): FailPaymentCommand {
        return new FailPaymentCommand(paymentId, userId);
    }

    static toGetByIdQuery(paymentId: string, userId: string): GetPaymentByIdQuery {
        return new GetPaymentByIdQuery(paymentId, userId);
    }

    static toListForUserQuery(userId: string): ListPaymentsForUserQuery {
        return new ListPaymentsForUserQuery(userId);
    }

    static toResponseDto(entity: PaymentEntity): PaymentResponseDto {
        return {
            paymentId: entity.id,
            orderId: entity.orderId,
            amount: entity.amount,
            status: entity.status,
            externalPaymentId: entity.externalPaymentId,
            clientSecret: entity.clientSecret,
            provider: entity.provider,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
        };
    }

    static toResponseList(entities: PaymentEntity[]): PaymentResponseDto[] {
        return entities.map((p) => this.toResponseDto(p));
    }
}

export default PaymentApiMapper;

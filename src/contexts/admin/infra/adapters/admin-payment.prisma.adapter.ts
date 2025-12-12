import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import PaymentAdminReadOnlyPort, { AdminPaymentSummary } from '../../application/ports/payment-admin.port';

@Injectable()
export class AdminPaymentPrismaAdapter implements PaymentAdminReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

    async listPayments(): Promise<AdminPaymentSummary[]> {
        const payments = await this.prisma.payment.findMany({ orderBy: { createdAt: 'desc' } });
        return payments.map((p) => this.toSummary(p));
    }

    async getPaymentById(id: string): Promise<AdminPaymentSummary | null> {
        const payment = await this.prisma.payment.findUnique({ where: { id } });
        return payment ? this.toSummary(payment) : null;
    }

    private toSummary(payment: { id: string; orderId: string; userId: string; amount: unknown; status: string; provider: string; createdAt: Date; updatedAt: Date }): AdminPaymentSummary {
        return {
            id: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            amount: Number(payment.amount),
            status: payment.status,
            provider: payment.provider,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    }
}

export default AdminPaymentPrismaAdapter;

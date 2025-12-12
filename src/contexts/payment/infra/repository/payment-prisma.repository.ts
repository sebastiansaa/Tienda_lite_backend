import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import PaymentRepositoryPort from '../../application/ports/payment.repository.port';
import { PaymentEntity } from '../../domain/entity/payment.entity';
import { paymentToPrisma, prismaToPayment } from '../mappers/payment-prisma.mapper';

@Injectable()
export class PaymentPrismaRepository implements PaymentRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(payment: PaymentEntity): Promise<PaymentEntity> {
        const data = paymentToPrisma(payment);
        const upserted = await this.prisma.payment.upsert({
            where: { id: data.id },
            create: data,
            update: data,
        });
        return prismaToPayment(upserted)!;
    }

    async findById(id: string): Promise<PaymentEntity | null> {
        const record = await this.prisma.payment.findUnique({ where: { id } });
        return prismaToPayment(record);
    }

    async listByUser(userId: string): Promise<PaymentEntity[]> {
        const records = await this.prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
        return records.map((r) => prismaToPayment(r)!) as PaymentEntity[];
    }
}

export default PaymentPrismaRepository;

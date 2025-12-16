import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import ProductAdminReadOnlyPort, { AdminProductSummary } from '../../app/ports/product-admin.readonly.port';
import { decimalToNumber } from '../../../products/infra/helpers/decimal.helper';

@Injectable()
export class AdminProductPrismaAdapter implements ProductAdminReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

    async listProducts(): Promise<AdminProductSummary[]> {
        const products = await this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
        return products.map((p) => this.toSummary(p));
    }

    async getProductById(id: number): Promise<AdminProductSummary | null> {
        const product = await this.prisma.product.findUnique({ where: { id } });
        return product ? this.toSummary(product) : null;
    }

    async updateProduct(id: number, data: Partial<Omit<AdminProductSummary, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AdminProductSummary | null> {
        const payload: Prisma.ProductUpdateInput = {};

        if (data.title !== undefined) payload.title = data.title;
        if (data.price !== undefined) payload.price = new Prisma.Decimal(data.price as any);
        if (data.stock !== undefined) payload.stock = data.stock;
        if (data.active !== undefined) payload.active = data.active;

        try {
            const updated = await this.prisma.product.update({ where: { id }, data: payload });
            return this.toSummary(updated);
        } catch {
            return null;
        }
    }

    private toSummary(product: { id: number; title: string; price: unknown; stock: number; active: boolean; createdAt: Date; updatedAt: Date }): AdminProductSummary {
        return {
            id: product.id,
            title: product.title,
            price: decimalToNumber(product.price),
            stock: product.stock,
            active: product.active,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}

export default AdminProductPrismaAdapter;

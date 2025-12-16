import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import UserAdminReadOnlyPort, { AdminUserProfile } from '../../app/ports/user-admin.readonly.port';

@Injectable()
export class AdminUserPrismaAdapter implements UserAdminReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

    async listUsers(): Promise<AdminUserProfile[]> {
        const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
        return users.map((u) => this.toProfile(u));
    }

    async getUserById(id: string): Promise<AdminUserProfile | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? this.toProfile(user) : null;
    }

    async changeStatus(id: string, status: string): Promise<AdminUserProfile | null> {
        try {
            const updated = await this.prisma.user.update({ where: { id }, data: { status } });
            return this.toProfile(updated);
        } catch {
            return null;
        }
    }

    private toProfile(user: { id: string; email: string; name: string | null; phone: string | null; status: string; createdAt: Date; updatedAt: Date; }): AdminUserProfile {
        return {
            id: user.id,
            email: user.email,
            name: user.name ?? '',
            phone: user.phone ?? null,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

export default AdminUserPrismaAdapter;

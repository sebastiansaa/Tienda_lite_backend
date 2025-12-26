import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminController } from './api/controller/admin.controller';
import { GetDashboardStatsUsecase } from './app/usecases/get-dashboard-stats.usecase';

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [AdminController],
    providers: [
        GetDashboardStatsUsecase,
    ],
})
export class AdminModule { }

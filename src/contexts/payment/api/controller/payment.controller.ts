import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { InitiatePaymentDto, PaymentResponseDto } from '../dtos';
import PaymentApiMapper from '../mappers/payment-api.mapper';
import {
    InitiatePaymentUsecase,
    ConfirmPaymentUsecase,
    FailPaymentUsecase,
    GetPaymentByIdUsecase,
    ListPaymentsForUserUsecase,
} from '../../app/usecases';
import { InvalidPaymentStateError, PaymentAlreadyProcessedError } from '../../domain/errors/payment.errors';

interface AuthUser {
    sub: string;
}

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('payments')
export class PaymentController {
    constructor(
        private readonly initiatePayment: InitiatePaymentUsecase,
        private readonly confirmPayment: ConfirmPaymentUsecase,
        private readonly failPayment: FailPaymentUsecase,
        private readonly getPaymentById: GetPaymentByIdUsecase,
        private readonly listPaymentsForUser: ListPaymentsForUserUsecase,
    ) { }

    @Post('initiate')
    @ApiOperation({ summary: 'Initiate a payment for an order' })
    @ApiResponse({ status: 201, type: PaymentResponseDto })
    async initiate(
        @CurrentUser() user: AuthUser,
        @Body() dto: InitiatePaymentDto,
    ): Promise<PaymentResponseDto> {
        try {
            const command = PaymentApiMapper.toInitiateCommand(dto, user.sub);
            const payment = await this.initiatePayment.execute(command);
            return PaymentApiMapper.toResponseDto(payment);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post(':id/confirm')
    @ApiOperation({ summary: 'Confirm a payment' })
    @ApiResponse({ status: 200, type: PaymentResponseDto })
    async confirm(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<PaymentResponseDto> {
        try {
            const command = PaymentApiMapper.toConfirmCommand(id, user.sub);
            const payment = await this.confirmPayment.execute(command);
            return PaymentApiMapper.toResponseDto(payment);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Post(':id/fail')
    @ApiOperation({ summary: 'Mark a payment as failed' })
    @ApiResponse({ status: 200, type: PaymentResponseDto })
    async fail(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<PaymentResponseDto> {
        try {
            const command = PaymentApiMapper.toFailCommand(id, user.sub);
            const payment = await this.failPayment.execute(command);
            return PaymentApiMapper.toResponseDto(payment);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get()
    @ApiOperation({ summary: 'List payments for current user' })
    @ApiResponse({ status: 200, type: [PaymentResponseDto] })
    async list(@CurrentUser() user: AuthUser): Promise<PaymentResponseDto[]> {
        const query = PaymentApiMapper.toListForUserQuery(user.sub);
        const payments = await this.listPaymentsForUser.execute(query);
        return PaymentApiMapper.toResponseList(payments);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get payment by id for current user' })
    @ApiResponse({ status: 200, type: PaymentResponseDto })
    async getById(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<PaymentResponseDto> {
        const query = PaymentApiMapper.toGetByIdQuery(id, user.sub);
        const payment = await this.getPaymentById.execute(query);
        if (!payment) throw new NotFoundException('Payment not found');
        return PaymentApiMapper.toResponseDto(payment);
    }

    private handleError(error: unknown): never {
        if (error instanceof PaymentAlreadyProcessedError) {
            throw new ConflictException(error.message);
        }
        if (error instanceof InvalidPaymentStateError) {
            throw new BadRequestException(error.message);
        }
        throw error as Error;
    }
}

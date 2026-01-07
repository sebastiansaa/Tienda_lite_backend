import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import CurrentUser from '../../../auth/api/decorators/current-user.decorator';
import { ConfirmPaymentDto, InitiatePaymentDto, PaymentResponseDto } from '../dtos';
import PaymentApiMapper from '../mappers/payment-api.mapper';
import {
    InitiatePaymentUsecase,
    ConfirmPaymentUsecase,
    FailPaymentUsecase,
    GetPaymentByIdUsecase,
    ListPaymentsForUserUsecase,
} from '../../app/usecases';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import type { AuthUserPayload } from '../../../shared/interfaces/auth-user-payload.interface';

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
    @ResponseMessage('Payment initiated successfully')
    @ApiOperation({ summary: 'Initiate a payment for an order' })
    @ApiResponse({ status: 201, type: PaymentResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid payment state or payload' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    async initiate(
        @CurrentUser() user: AuthUserPayload,
        @Body() dto: InitiatePaymentDto,
    ): Promise<PaymentResponseDto> {
        const command = PaymentApiMapper.toInitiateCommand(dto, user.sub);
        const payment = await this.initiatePayment.execute(command);
        return PaymentApiMapper.toResponseDto(payment);
    }

    @Post(':id/confirm')
    @ResponseMessage('Payment confirmed successfully')
    @ApiOperation({ summary: 'Confirm a payment' })
    @ApiResponse({ status: 200, type: PaymentResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid payment state' })
    @ApiResponse({ status: 404, description: 'Payment not found' })
    @ApiResponse({ status: 409, description: 'Payment already processed' })
    async confirm(@CurrentUser() user: AuthUserPayload, @Param('id') id: string, @Body() dto: ConfirmPaymentDto): Promise<PaymentResponseDto> {
        const command = PaymentApiMapper.toConfirmCommand(id, user.sub, dto?.paymentMethodToken);
        const payment = await this.confirmPayment.execute(command);
        return PaymentApiMapper.toResponseDto(payment);
    }

    @Post(':id/fail')
    @ResponseMessage('Payment failure recorded')
    @ApiOperation({ summary: 'Mark a payment as failed' })
    @ApiResponse({ status: 200, type: PaymentResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid payment state' })
    @ApiResponse({ status: 404, description: 'Payment not found' })
    @ApiResponse({ status: 409, description: 'Payment already processed' })
    async fail(@CurrentUser() user: AuthUserPayload, @Param('id') id: string): Promise<PaymentResponseDto> {
        const command = PaymentApiMapper.toFailCommand(id, user.sub);
        const payment = await this.failPayment.execute(command);
        return PaymentApiMapper.toResponseDto(payment);
    }

    @Get()
    @ResponseMessage('User payments retrieved successfully')
    @ApiOperation({ summary: 'List payments for current user' })
    @ApiResponse({ status: 200, type: [PaymentResponseDto] })
    async list(@CurrentUser() user: AuthUserPayload): Promise<PaymentResponseDto[]> {
        const query = PaymentApiMapper.toListForUserQuery(user.sub);
        const payments = await this.listPaymentsForUser.execute(query);
        return PaymentApiMapper.toResponseList(payments);
    }

    @Get(':id')
    @ResponseMessage('Payment details retrieved successfully')
    @ApiOperation({ summary: 'Get payment by id for current user' })
    @ApiResponse({ status: 200, type: PaymentResponseDto })
    @ApiResponse({ status: 404, description: 'Payment not found' })
    async getById(@CurrentUser() user: AuthUserPayload, @Param('id') id: string): Promise<PaymentResponseDto> {
        const query = PaymentApiMapper.toGetByIdQuery(id, user.sub);
        const payment = await this.getPaymentById.execute(query);
        if (!payment) throw new NotFoundException('Payment not found');
        return PaymentApiMapper.toResponseDto(payment);
    }
}

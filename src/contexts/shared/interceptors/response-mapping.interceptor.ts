import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseMappingInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    constructor(private reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const message = this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || 'Operation successful';
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return next.handle().pipe(
            map((data) => ({
                statusCode,
                message,
                data: data !== undefined ? data : null,
            })),
        );
    }
}

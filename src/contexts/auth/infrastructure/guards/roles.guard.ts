import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!required || required.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user as { roles?: string[] } | undefined;
        if (!user || !user.roles) {
            return false;
        }

        return required.every((role) => user.roles?.includes(role));
    }
}

export default RolesGuard;

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    login(payload: any) {
        return { access_token: this.jwtService.sign(payload) };
    }

    // placeholder for user validation - implement as needed
    async validateUser(username: string, pass: string) {
        // integrate with Prisma or DB to validate
        return null;
    }
}

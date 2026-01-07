import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_READ_REPOSITORY } from '../../constants';
import type { IUserReadRepository } from '../../app/ports/user-read.repository';
import type UserVerificationPort from '../../../shared/ports/user-verification.port';

@Injectable()
export class UserVerificationService implements UserVerificationPort {
    constructor(
        @Inject(USER_READ_REPOSITORY)
        private readonly userReadRepo: IUserReadRepository,
    ) { }

    async ensureUserExists(userId: string): Promise<void> {
        const user = await this.userReadRepo.findById(userId);
        if (!user) throw new NotFoundException('User not found');
        if (user.status === 'INACTIVE') throw new NotFoundException('User not found');
    }
}

export default UserVerificationService;
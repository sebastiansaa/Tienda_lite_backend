import UserAdminReadOnlyPort from '../ports/user-admin.port';

export class ChangeAdminUserStatusUsecase {
    constructor(private readonly userPort: UserAdminReadOnlyPort) { }

    execute(userId: string, status: string) {
        return this.userPort.changeStatus(userId, status);
    }
}

export default ChangeAdminUserStatusUsecase;

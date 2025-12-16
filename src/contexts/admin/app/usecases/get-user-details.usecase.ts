import UserAdminReadOnlyPort, { AdminUserProfile } from '../ports/user-admin.readonly.port';

export class GetAdminUserDetailsUsecase {
    constructor(private readonly userPort: UserAdminReadOnlyPort) { }

    execute(id: string) {
        return this.userPort.getUserById(id);
    }
}

export default GetAdminUserDetailsUsecase;

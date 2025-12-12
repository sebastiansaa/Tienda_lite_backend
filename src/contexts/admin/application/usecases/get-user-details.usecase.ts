import UserAdminReadOnlyPort from '../ports/user-admin.port';

export class GetAdminUserDetailsUsecase {
    constructor(private readonly userPort: UserAdminReadOnlyPort) { }

    execute(id: string) {
        return this.userPort.getUserById(id);
    }
}

export default GetAdminUserDetailsUsecase;

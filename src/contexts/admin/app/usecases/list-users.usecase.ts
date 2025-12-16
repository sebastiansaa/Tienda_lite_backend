import UserAdminReadOnlyPort, { AdminUserProfile } from '../ports/user-admin.readonly.port';

export class ListAdminUsersUsecase {
    constructor(private readonly userPort: UserAdminReadOnlyPort) { }

    execute() {
        return this.userPort.listUsers();
    }
}

export default ListAdminUsersUsecase;

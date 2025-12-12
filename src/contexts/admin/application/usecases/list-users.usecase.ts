import UserAdminReadOnlyPort from '../ports/user-admin.port';

export class ListAdminUsersUsecase {
    constructor(private readonly userPort: UserAdminReadOnlyPort) { }

    execute() {
        return this.userPort.listUsers();
    }
}

export default ListAdminUsersUsecase;

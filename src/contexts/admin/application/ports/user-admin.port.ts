export interface AdminUserProfile {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserAdminReadOnlyPort {
    listUsers(): Promise<AdminUserProfile[]>;
    getUserById(id: string): Promise<AdminUserProfile | null>;
    changeStatus(id: string, status: string): Promise<AdminUserProfile | null>;
}

export default UserAdminReadOnlyPort;

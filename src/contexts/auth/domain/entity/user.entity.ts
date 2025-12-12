import { randomUUID } from 'crypto';
import { EmailVO } from '../v-o/email.vo';
import { PasswordHashVO } from '../v-o/password-hash.vo';
import { RoleVO } from '../v-o/role.vo';

export interface UserProps {
    id?: string; // UUID
    email: string;
    passwordHash: string;
    roles?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserEntity {
    readonly id: string;
    private readonly emailVO: EmailVO;
    private passwordHashVO: PasswordHashVO;
    private rolesVO: RoleVO[];
    createdAt: Date;
    updatedAt: Date;

    constructor(props: UserProps) {
        const now = new Date();
        this.id = props.id ?? randomUUID();
        this.emailVO = new EmailVO(props.email);
        this.passwordHashVO = new PasswordHashVO(props.passwordHash);
        this.rolesVO = (props.roles ?? ['user']).map((r) => new RoleVO(r));
        this.createdAt = props.createdAt ?? now;
        this.updatedAt = props.updatedAt ?? now;
    }

    get email(): string {
        return this.emailVO.value;
    }

    get roles(): string[] {
        return this.rolesVO.map((r) => r.value);
    }

    get passwordHash(): string {
        return this.passwordHashVO.value;
    }

    setPasswordHash(hash: string): void {
        this.passwordHashVO = new PasswordHashVO(hash);
        this.touch();
    }

    touch(): void {
        this.updatedAt = new Date();
    }
}

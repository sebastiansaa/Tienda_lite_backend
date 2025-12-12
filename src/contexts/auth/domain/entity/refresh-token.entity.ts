import { randomUUID } from 'crypto';

export interface RefreshTokenProps {
    id?: string; // UUID
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt?: Date;
}

export class RefreshTokenEntity {
    readonly id: string;
    readonly userId: string;
    readonly tokenHash: string;
    readonly expiresAt: Date;
    readonly createdAt: Date;

    constructor(props: RefreshTokenProps) {
        this.id = props.id ?? randomUUID();
        this.userId = props.userId;
        this.tokenHash = props.tokenHash;
        this.expiresAt = props.expiresAt;
        this.createdAt = props.createdAt ?? new Date();
    }

    isExpired(now: Date = new Date()): boolean {
        return this.expiresAt.getTime() <= now.getTime();
    }
}

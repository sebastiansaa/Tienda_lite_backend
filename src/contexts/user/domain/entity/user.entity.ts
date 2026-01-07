import { EmailVO, NameVO, DateVO, Slug } from '../../../shared/v-o';
import UserStatusVO, { UserStatus } from '../v-o/user-status.vo';
import AddressEntity, { AddressProps } from './address.entity';
import { AddressNotFoundError, InvalidUserStatusError } from '../errors/user.errors';

export interface UserProps {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
    status?: UserStatus;
    preferences?: Record<string, unknown> | null;
    addresses?: AddressProps[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserEntity {
    private readonly idVO: Slug;
    private emailVO: EmailVO;
    private nameVO: NameVO;
    private phoneValue: string;
    private statusVO: UserStatusVO;
    private preferencesValue: Record<string, unknown> | null;
    private addressesInternal: AddressEntity[];
    private createdAtVO: DateVO;
    private updatedAtVO: DateVO;

    constructor(props: UserProps) {
        this.idVO = new Slug(props.id);
        this.emailVO = new EmailVO(props.email);
        this.nameVO = new NameVO(props.name);
        this.phoneValue = props.phone ?? 'N/A';
        this.statusVO = new UserStatusVO(props.status ?? 'ACTIVE');
        this.preferencesValue = props.preferences ?? null;
        this.addressesInternal = (props.addresses ?? []).map((a) => new AddressEntity(a));
        this.createdAtVO = new DateVO(props.createdAt);
        this.updatedAtVO = DateVO.from(props.updatedAt);
    }

    get id(): string { return this.idVO.value; }
    get email(): string { return this.emailVO.value; }
    get name(): string { return this.nameVO.value; }
    get phone(): string | null { return this.phoneValue; }
    get status(): UserStatus { return this.statusVO.value; }
    get preferences(): Record<string, unknown> | null { return this.preferencesValue; }
    get addresses(): AddressEntity[] { return [...this.addressesInternal]; }
    get createdAt(): Date { return this.createdAtVO.value; }
    get updatedAt(): Date { return this.updatedAtVO.value; }

    updateProfile(data: { name?: string; phone?: string | null; preferences?: Record<string, unknown> | null }): void {
        if (data.name !== undefined) this.nameVO = new NameVO(data.name);
        if (data.phone !== undefined) this.phoneValue = data.phone ?? 'N/A';
        if (data.preferences !== undefined) this.preferencesValue = data.preferences;
        this.touch();
    }

    addAddress(address: AddressProps): AddressEntity {
        const entity = new AddressEntity(address);
        this.addressesInternal = [...this.addressesInternal, entity];
        this.touch();
        return entity;
    }

    updateAddress(addressId: string, data: Partial<AddressProps>): AddressEntity {
        const addr = this.addressesInternal.find((a) => a.id === addressId);
        if (!addr) throw new AddressNotFoundError('Address not found');
        addr.update(data);
        this.touch();
        return addr;
    }

    deleteAddress(addressId: string): void {
        const exists = this.addressesInternal.some((a) => a.id === addressId);
        if (!exists) throw new AddressNotFoundError('Address not found');
        this.addressesInternal = this.addressesInternal.filter((a) => a.id !== addressId);
        this.touch();
    }

    changeStatus(status: UserStatus): void {
        this.statusVO = new UserStatusVO(status);
        this.touch();
    }

    private touch(): void {
        this.updatedAtVO = DateVO.now();
    }
}

export default UserEntity;

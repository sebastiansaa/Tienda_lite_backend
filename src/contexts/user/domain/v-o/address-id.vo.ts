import { randomUUID } from 'crypto';

export class AddressIdVO {
    private readonly _value: string;

    constructor(value?: string) {
        this._value = value ?? randomUUID();
    }

    get value(): string {
        return this._value;
    }
}

export default AddressIdVO;

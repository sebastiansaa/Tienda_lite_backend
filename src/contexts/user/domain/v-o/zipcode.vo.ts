import { InvalidAddressError } from '../errors/user.errors';

export class ZipCodeVO {
    private readonly _value: string;

    constructor(value: string) {
        if (!value || !value.trim()) throw new InvalidAddressError('ZipCode is required');
        this._value = value.trim();
    }

    get value(): string {
        return this._value;
    }
}

export default ZipCodeVO;

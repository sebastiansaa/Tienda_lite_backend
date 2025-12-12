import { InvalidAddressError } from '../errors/user.errors';

export class CountryVO {
    private readonly _value: string;

    constructor(value: string) {
        if (!value || !value.trim()) throw new InvalidAddressError('Country is required');
        this._value = value.trim();
    }

    get value(): string {
        return this._value;
    }
}

export default CountryVO;

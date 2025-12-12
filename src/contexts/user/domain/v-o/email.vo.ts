import { InvalidEmailError } from '../errors/user.errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailVO {
    private readonly _value: string;

    constructor(value: string) {
        if (!value || !EMAIL_REGEX.test(value)) throw new InvalidEmailError();
        this._value = value.toLowerCase();
    }

    get value(): string {
        return this._value;
    }
}

export default EmailVO;

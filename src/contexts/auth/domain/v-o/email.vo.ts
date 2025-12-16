import { InvalidEmailError } from '../errors/auth.errors';

export class EmailVO {
    private readonly _value: string;
    constructor(value: unknown) {
        if (value === undefined || value === null) throw new InvalidEmailError('Email is required');
        if (typeof value !== 'string') throw new InvalidEmailError('Email must be string');
        const v = value.trim().toLowerCase();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(v)) throw new InvalidEmailError('Invalid email format');
        this._value = v;
    }
    get value(): string {
        return this._value;
    }
}

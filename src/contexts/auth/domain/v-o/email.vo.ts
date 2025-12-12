export class EmailVO {
    private readonly _value: string;
    constructor(value: unknown) {
        if (value === undefined || value === null) throw new Error('Email is required');
        if (typeof value !== 'string') throw new Error('Email must be string');
        const v = value.trim().toLowerCase();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(v)) throw new Error('Invalid email format');
        this._value = v;
    }
    get value(): string {
        return this._value;
    }
}

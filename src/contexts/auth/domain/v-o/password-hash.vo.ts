export class PasswordHashVO {
    private readonly _value: string;
    constructor(hash: unknown) {
        if (hash === undefined || hash === null) throw new Error('Password hash required');
        if (typeof hash !== 'string') throw new Error('Password hash must be string');
        if (hash.length < 20) throw new Error('Invalid password hash');
        this._value = hash;
    }
    get value(): string {
        return this._value;
    }
}

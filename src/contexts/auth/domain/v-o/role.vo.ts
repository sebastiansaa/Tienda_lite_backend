export class RoleVO {
    private readonly _value: string;
    static readonly ALLOWED = ['user', 'admin'];
    constructor(value: unknown) {
        if (value === undefined || value === null) throw new Error('Role is required');
        if (typeof value !== 'string') throw new Error('Role must be string');
        const v = value.trim().toLowerCase();
        if (!RoleVO.ALLOWED.includes(v)) throw new Error('Invalid role');
        this._value = v;
    }
    get value(): string {
        return this._value;
    }
}

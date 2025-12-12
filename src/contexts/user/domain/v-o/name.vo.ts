export class NameVO {
    private readonly _value: string;

    constructor(value: string) {
        if (!value || !value.trim()) throw new Error('Name is required');
        this._value = value.trim();
    }

    get value(): string {
        return this._value;
    }
}

export default NameVO;

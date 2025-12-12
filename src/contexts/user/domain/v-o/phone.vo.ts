export class PhoneVO {
    private readonly _value: string | null;

    constructor(value?: string | null) {
        if (value === undefined || value === null || value === '') {
            this._value = null;
            return;
        }
        const normalized = value.trim();
        if (!normalized) {
            this._value = null;
            return;
        }
        this._value = normalized;
    }

    get value(): string | null {
        return this._value;
    }
}

export default PhoneVO;

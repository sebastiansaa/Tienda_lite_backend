export class UserIdVO {
    constructor(public readonly value: string) {
        if (!value) throw new Error('UserIdVO requires a value');
    }
}

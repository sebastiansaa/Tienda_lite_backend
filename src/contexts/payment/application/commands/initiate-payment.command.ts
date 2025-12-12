export class InitiatePaymentCommand {
    constructor(
        public readonly orderId: string,
        public readonly amount: number,
        public readonly userId: string,
    ) { }
}

export default InitiatePaymentCommand;

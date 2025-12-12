export class ConfirmPaymentCommand {
    constructor(
        public readonly paymentId: string,
        public readonly userId: string,
    ) { }
}

export default ConfirmPaymentCommand;

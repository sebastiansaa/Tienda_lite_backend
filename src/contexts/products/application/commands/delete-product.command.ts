export class DeleteProductCommand {
  constructor(public readonly id: number, public readonly soft: boolean = true) {}
}

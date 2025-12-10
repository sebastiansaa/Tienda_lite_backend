export class CreateProductCommand {
    constructor(public readonly title: string, public readonly price: number, public readonly categoryId?: string) { }
}

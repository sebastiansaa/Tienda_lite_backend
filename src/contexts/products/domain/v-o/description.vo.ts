export class Description {
    private readonly valor: string;

    constructor(valor: string) {
        if (valor === undefined || valor === null) {
            throw new Error('La descripción no puede ser nula');
        }
        this.valor = valor.trim();
    }

    get value(): string {
        return this.valor;
    }
}

export default Description;

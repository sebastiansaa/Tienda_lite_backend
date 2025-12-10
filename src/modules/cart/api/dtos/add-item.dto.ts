export type AddItemDto = { productId: string; quantity: number };

export class AddItemRequestDto {
    userId!: string;
    item!: AddItemDto;
}

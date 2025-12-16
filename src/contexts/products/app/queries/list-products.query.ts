export interface ListProductsParams {
  readonly page?: number;
  readonly limit?: number;
}

export class ListProductsQuery {
  constructor(public readonly params?: Readonly<ListProductsParams>) { }
}

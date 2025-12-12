import { ProductProps } from '../../domain/interfaces/productProp';

export class SaveProductCommand {
  constructor(public readonly payload: Readonly<Partial<ProductProps>>) { }
}

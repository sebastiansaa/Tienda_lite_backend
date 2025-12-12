import ProductIdVO from '../v-o/product-id.vo';
import QuantityVO from '../v-o/quantity.vo';
import PriceVO from '../v-o/price.vo';
import { InvalidQuantityError } from '../errors/cart.errors';

export interface CartItemProps {
    productId: number;
    quantity: number;
    price?: number;
}

export class CartItemEntity {
    private productIdVO: ProductIdVO;
    private quantityVO: QuantityVO;
    private priceVO?: PriceVO;

    constructor(props: CartItemProps) {
        this.productIdVO = new ProductIdVO(props.productId);
        this.quantityVO = new QuantityVO(props.quantity);
        this.priceVO = props.price !== undefined ? new PriceVO(props.price) : undefined;
    }

    get productId(): number {
        return this.productIdVO.value;
    }

    get quantity(): number {
        return this.quantityVO.value;
    }

    get price(): number | undefined {
        return this.priceVO?.value;
    }

    get lineTotal(): number {
        const price = this.priceVO?.value ?? 0;
        return price * this.quantityVO.value;
    }

    updateQuantity(quantity: number): void {
        if (quantity <= 0) throw new InvalidQuantityError();
        this.quantityVO = new QuantityVO(quantity);
    }

    withPrice(price?: number): CartItemEntity {
        const copy = new CartItemEntity({ productId: this.productId, quantity: this.quantity, price });
        return copy;
    }
}

export default CartItemEntity;

import {
    EmptyTitleError, ImagesArrayNullError,
    ActiveProductError, DesactiveProductError,
    InvalidCategoryError, InvalidProductTitleError,
    InvalidImageUrlError, ImageNotFoundError
} from "../errors";

import { ProductProps } from "../interfaces/productProp";
import { Slug } from "../v-o/slug.vo.ts";
import { Price } from "../v-o/price.vo";
import { StockEntity } from "./stock.entity";

export class ProductEntity {
    id: number;
    title: string;
    slug: string;
    price: number;
    description: string;
    stock: StockEntity;
    active: boolean;
    images: string[];
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: ProductProps) {
        if (!props.title || props.title.trim() === "") throw new EmptyTitleError();

        this.slug = new Slug(props.slug).value;
        this.price = new Price(props.price).value;

        if (!props.images || props.images.length === 0) throw new ImagesArrayNullError();
        if (!props.categoryId || props.categoryId <= 0) throw new InvalidCategoryError();

        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.stock = new StockEntity(props.stock); // delega a StockEntity
        this.active = props.active;
        this.images = props.images;
        this.categoryId = props.categoryId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;

        if (this.stock.isEmpty()) this.markAsInactive();
    }

    // --- Métodos de negocio principales ---
    remove(): void {
        if (!this.active) throw new DesactiveProductError();
        if (!this.stock.isEmpty()) throw new Error("No puedes eliminar un producto con stock");
        this.active = false;
    }

    restore(): void {
        if (this.active) throw new ActiveProductError();
        this.active = true;
    }

    canBePurchased(): boolean {
        return this.active && !this.stock.isEmpty();
    }

    // --- Métodos semánticos con VO ---
    changePrice(newPrice: number | string): void {
        const priceVO = new Price(newPrice);
        this.price = priceVO.value;
    }

    changeSlug(newSlug: string): void {
        const slugVO = new Slug(newSlug);
        this.slug = slugVO.value;
    }

    rename(newTitle: string): void {
        if (!newTitle || typeof newTitle !== "string") throw new InvalidProductTitleError();
        this.title = newTitle;
    }

    changeDescription(newDescription: string): void {
        this.description = newDescription ?? "";
    }

    // --- Manejo de imágenes ---
    addImage(url: string): void {
        if (!url || typeof url !== "string") throw new InvalidImageUrlError();
        let isValid = false;
        try {
            const parsed = new URL(url);
            isValid = /^https?:$/.test(parsed.protocol);
        } catch {
            isValid = false;
        }
        if (!isValid) throw new InvalidImageUrlError();
        this.images.push(url);
    }

    removeImage(url: string): void {
        const idx = this.images.indexOf(url);
        if (idx === -1) throw new ImageNotFoundError();
        this.images.splice(idx, 1);
    }

    replaceImages(urls: string[]): void {
        this.images = [];
        urls.forEach((url) => this.addImage(url));
    }

    // --- Helpers privados ---
    private markAsInactive(): void {
        this.active = false;
    }
}
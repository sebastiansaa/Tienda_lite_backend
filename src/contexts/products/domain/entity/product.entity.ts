import {
    EmptyTitleError, ImagesArrayNullError,
    ActiveProductError, DesactiveProductError,
    InvalidCategoryError, InvalidProductTitleError,
    InvalidImageUrlError, ImageNotFoundError
} from "../errors";

import { ProductProps } from "../interfaces/productProp";
import { Slug, SoftDeleteVO } from "../../../shared/v-o";
import { Price, Title, ImagesVO } from "../v-o";
import { StockEntity } from "./stock.entity";

export class ProductEntity {
    id?: number;
    title: string;
    slug: string;
    price: number;
    description: string;
    stock: StockEntity; // delega a StockEntity
    private deletedAt: SoftDeleteVO;
    private imagesVO: ImagesVO;
    private deletedAtVO: SoftDeleteVO;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: ProductProps) {
        const titleVO = new Title(props.title);
        this.title = titleVO.value;

        this.slug = new Slug(props.slug).value;
        this.price = new Price(props.price).value;

        if (!props.images || props.images.length === 0) throw new ImagesArrayNullError();
        if (!props.categoryId || props.categoryId <= 0) throw new InvalidCategoryError();

        this.id = props.id;
        this.description = props.description;
        this.stock = new StockEntity(props.stock); // delega a StockEntity
        this.deletedAtVO = new SoftDeleteVO(props.deletedAt ?? (props.active === false ? new Date() : undefined));
        this.imagesVO = new ImagesVO(props.images);
        this.categoryId = props.categoryId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;

        if (this.stock.isEmpty()) this.markAsInactive();
    }

    // --- Métodos de negocio principales ---
    remove(): void {
        if (!this.active) throw new DesactiveProductError();
        if (!this.stock.isEmpty()) throw new Error("No puedes eliminar un producto con stock");
        this.deletedAtVO = this.deletedAtVO.delete();
    }

    restore(): void {
        if (this.active) throw new ActiveProductError();
        this.deletedAtVO = this.deletedAtVO.restore();
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
        const titleVO = new Title(newTitle);
        this.title = titleVO.value;
    }

    changeDescription(newDescription: string): void {
        this.description = newDescription ?? "";
    }

    // --- Manejo de imágenes ---
    addImage(url: string): void {
        const next = this.imagesVO.add(url);
        this.imagesVO = next;
    }

    removeImage(url: string): void {
        try {
            this.imagesVO = this.imagesVO.remove(url);
        } catch {
            throw new ImageNotFoundError();
        }
    }

    replaceImages(urls: string[]): void {
        this.imagesVO = this.imagesVO.replace(urls);
    }

    // --- Helpers privados ---
    private markAsInactive(): void {
        this.deletedAtVO = this.deletedAtVO.delete();
    }

    // --- Getters expuestos ---
    get active(): boolean {
        return !this.deletedAtVO.isDeleted();
    }

    get deletedAt(): Date | undefined {
        return this.deletedAtVO.value;
    }

    get images(): string[] {
        return this.imagesVO.values;
    }
}
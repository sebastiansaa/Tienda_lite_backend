import {
    ImagesArrayNullError,
    ActiveProductError,
    DesactiveProductError,
    InvalidCategoryError,
    ImageNotFoundError,
} from '../errors';
import { ProductProps } from './productPropInterface';
import { Slug, SoftDeleteVO } from '../../../shared/v-o';
import { Price, Title, ImagesVO, Description, CategoryId } from '../v-o';
import { StockEntity } from './stock.entity';

export class ProductEntity {
    private readonly idValue?: number;
    private titleVO: Title;
    private slugVO: Slug;
    private priceVO: Price;
    private descriptionVO: Description;
    private stockEntity: StockEntity;
    private imagesVO: ImagesVO;
    private deletedAtVO: SoftDeleteVO;
    private categoryIdVO: CategoryId;
    private createdAtValue: Date;
    private updatedAtValue: Date;

    private constructor(props: ProductProps) {
        if (!props.images || props.images.length === 0) throw new ImagesArrayNullError();
        if (!props.categoryId || props.categoryId <= 0) throw new InvalidCategoryError();

        this.idValue = props.id;
        this.titleVO = new Title(props.title);
        this.slugVO = new Slug(props.slug);
        this.priceVO = new Price(props.price);
        this.descriptionVO = new Description(props.description ?? '');
        this.stockEntity = new StockEntity(props.stock);
        this.deletedAtVO = new SoftDeleteVO(props.deletedAt ?? (props.active === false ? new Date() : undefined));
        this.imagesVO = new ImagesVO(props.images);
        this.categoryIdVO = new CategoryId(props.categoryId);
        const now = new Date();
        this.createdAtValue = props.createdAt ?? now;
        this.updatedAtValue = props.updatedAt ?? now;

        if (this.stockEntity.isEmpty()) this.markAsInactive();
    }

    static create(props: Omit<ProductProps, 'createdAt' | 'updatedAt' | 'deletedAt'> & { deletedAt?: Date | null }): ProductEntity {
        const now = new Date();
        return new ProductEntity({
            ...props,
            createdAt: now,
            updatedAt: now,
        });
    }

    static rehydrate(props: ProductProps): ProductEntity {
        return new ProductEntity(props);
    }

    remove(): void {
        if (!this.active) throw new DesactiveProductError();
        if (!this.stockEntity.isEmpty()) throw new Error('No puedes eliminar un producto con stock');
        this.deletedAtVO = this.deletedAtVO.delete();
        this.touch();
    }

    restore(): void {
        if (this.active) throw new ActiveProductError();
        this.deletedAtVO = this.deletedAtVO.restore();
        this.touch();
    }

    canBePurchased(): boolean {
        return this.active && !this.stockEntity.isEmpty();
    }

    changePrice(newPrice: number | string): void {
        this.priceVO = new Price(newPrice);
        this.touch();
    }

    changeSlug(newSlug: string): void {
        this.slugVO = new Slug(newSlug);
        this.touch();
    }

    rename(newTitle: string): void {
        this.titleVO = new Title(newTitle);
        this.touch();
    }

    changeDescription(newDescription: string): void {
        this.descriptionVO = new Description(newDescription ?? '');
        this.touch();
    }

    addImage(url: string): void {
        this.imagesVO = this.imagesVO.add(url);
        this.touch();
    }

    removeImage(url: string): void {
        try {
            this.imagesVO = this.imagesVO.remove(url);
            this.touch();
        } catch {
            throw new ImageNotFoundError();
        }
    }

    replaceImages(urls: string[]): void {
        this.imagesVO = this.imagesVO.replace(urls);
        this.touch();
    }

    setStock(quantity: number): void {
        this.stockEntity.set(quantity);
        this.touch();
    }

    private markAsInactive(): void {
        this.deletedAtVO = this.deletedAtVO.delete();
    }

    private touch(): void {
        this.updatedAtValue = new Date();
    }

    get id(): number | undefined { return this.idValue; }
    get title(): string { return this.titleVO.value; }
    get slug(): string { return this.slugVO.value; }
    get price(): number { return this.priceVO.value; }
    get description(): string { return this.descriptionVO.value; }
    get stock(): number { return this.stockEntity.value; }
    get categoryId(): number { return this.categoryIdVO.value; }
    get createdAt(): Date { return this.createdAtValue; }
    get updatedAt(): Date { return this.updatedAtValue; }
    get active(): boolean { return !this.deletedAtVO.isDeleted(); }
    get deletedAt(): Date | undefined { return this.deletedAtVO.value; }
    get images(): string[] { return this.imagesVO.values; }
}

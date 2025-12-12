import { CategoryProps } from "../interfaces/category.props";
import { TitleVO, Slug, ImageUrlVO } from "../../../shared/v-o";

export class CategoryEntity {
    id?: number;
    title: string;
    slug: string;
    image: string;
    description?: string;
    active: boolean;
    sortOrder: number;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(props: CategoryProps) {
        this.id = props.id;
        this.title = new TitleVO(props.title).value;
        this.slug = new Slug(props.slug).value;
        this.image = new ImageUrlVO(props.image).value;
        this.description = props.description;
        this.active = props.active ?? true;
        this.sortOrder = props.sortOrder ?? 0;
        this.deletedAt = props.deletedAt;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: CategoryProps): CategoryEntity {
        return new CategoryEntity(props);
    }

    update(props: Partial<CategoryProps>): void {
        if (props.title) this.title = new TitleVO(props.title).value;
        if (props.slug) this.slug = new Slug(props.slug).value;
        if (props.image) this.image = new ImageUrlVO(props.image).value;
        if (props.description !== undefined) this.description = props.description;
        if (props.active !== undefined) this.active = props.active;
        if (props.sortOrder !== undefined) this.sortOrder = props.sortOrder;
    }

    delete(): void {
        this.active = false;
        this.deletedAt = new Date();
    }

    restore(): void {
        this.active = true;
        this.deletedAt = null;
    }
}

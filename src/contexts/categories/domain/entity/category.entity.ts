import { CategoryProps } from "../interfaces/category.props";
import { TitleVO, Slug, ImageUrlVO, SoftDeleteVO } from "../../../shared/v-o";

export class CategoryEntity {
    id?: number;
    title: string;
    slug: string;
    image: string;
    description?: string;
    sortOrder: number;
    private deletedAtVO: SoftDeleteVO;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: CategoryProps) {
        this.id = props.id;
        this.title = new TitleVO(props.title).value;
        this.slug = new Slug(props.slug).value;
        this.image = new ImageUrlVO(props.image).value;
        this.description = props.description;
        this.sortOrder = props.sortOrder ?? 0;
        this.deletedAtVO = new SoftDeleteVO(props.deletedAt ?? (props.active === false ? new Date() : undefined));
        const now = new Date();
        this.createdAt = props.createdAt ?? now;
        this.updatedAt = props.updatedAt ?? now;
    }

    static create(props: CategoryProps): CategoryEntity {
        return new CategoryEntity(props);
    }

    update(props: Partial<CategoryProps>): void {
        if (props.title) this.title = new TitleVO(props.title).value;
        if (props.slug) this.slug = new Slug(props.slug).value;
        if (props.image) this.image = new ImageUrlVO(props.image).value;
        if (props.description !== undefined) this.description = props.description;
        if (props.active !== undefined) {
            if (props.active && this.deletedAtVO.isDeleted()) this.restore();
            if (!props.active && !this.deletedAtVO.isDeleted()) this.delete();
        }
        if (props.sortOrder !== undefined) this.sortOrder = props.sortOrder;
        this.updatedAt = new Date();
    }

    delete(): void {
        this.deletedAtVO = this.deletedAtVO.delete();
        this.updatedAt = new Date();
    }

    restore(): void {
        this.deletedAtVO = this.deletedAtVO.restore();
        this.updatedAt = new Date();
    }

    get active(): boolean {
        return !this.deletedAtVO.isDeleted();
    }

    get deletedAt(): Date | undefined {
        return this.deletedAtVO.value;
    }
}

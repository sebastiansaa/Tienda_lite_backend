import AddressIdVO from '../v-o/address-id.vo';
import StreetVO from '../v-o/street.vo';
import CityVO from '../v-o/city.vo';
import CountryVO from '../v-o/country.vo';
import ZipCodeVO from '../v-o/zipcode.vo';
import CreatedAtVO from '../v-o/created-at.vo';
import UpdatedAtVO from '../v-o/updated-at.vo';

export interface AddressProps {
    id?: string;
    street: string;
    city: string;
    country: string;
    zipCode: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class AddressEntity {
    private readonly idVO: AddressIdVO;
    private streetVO: StreetVO;
    private cityVO: CityVO;
    private countryVO: CountryVO;
    private zipVO: ZipCodeVO;
    private createdAtVO: CreatedAtVO;
    private updatedAtVO: UpdatedAtVO;

    constructor(props: AddressProps) {
        this.idVO = new AddressIdVO(props.id);
        this.streetVO = new StreetVO(props.street);
        this.cityVO = new CityVO(props.city);
        this.countryVO = new CountryVO(props.country);
        this.zipVO = new ZipCodeVO(props.zipCode);
        this.createdAtVO = new CreatedAtVO(props.createdAt);
        this.updatedAtVO = UpdatedAtVO.from(props.updatedAt);
    }

    get id(): string { return this.idVO.value; }
    get street(): string { return this.streetVO.value; }
    get city(): string { return this.cityVO.value; }
    get country(): string { return this.countryVO.value; }
    get zipCode(): string { return this.zipVO.value; }
    get createdAt(): Date { return this.createdAtVO.value; }
    get updatedAt(): Date { return this.updatedAtVO.value; }

    update(data: Partial<Omit<AddressProps, 'id'>>): void {
        if (data.street !== undefined) this.streetVO = new StreetVO(data.street);
        if (data.city !== undefined) this.cityVO = new CityVO(data.city);
        if (data.country !== undefined) this.countryVO = new CountryVO(data.country);
        if (data.zipCode !== undefined) this.zipVO = new ZipCodeVO(data.zipCode);
        this.touch();
    }

    private touch(): void {
        this.updatedAtVO = UpdatedAtVO.now();
    }
}

export default AddressEntity;

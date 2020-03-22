import { IAddress } from 'models/inteface/address.interface copy';

export class Address implements IAddress {
    nation: string;
    city: string;
    street: string;
    constructor(nation?: string, city?: string, street?: string) {
        this.nation = nation || '';
        this.city = city || '';
        this.street = street || '';
    }
}
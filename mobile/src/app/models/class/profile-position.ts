import { IPosition } from 'models/inteface/position.interface';

export class Position implements IPosition {
    lat: string;
    lng: string;

    constructor(lat?: string, lng?: string) {
        this.lat = lat || '';
        this.lng = lng || '';
    }
}
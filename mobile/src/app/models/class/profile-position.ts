import { IPosition } from 'models/inteface/position.interface';

export class ProfilePosition implements IPosition {
    lat: number;
    lng: number;

    constructor(lat?: number, lng?: number) {
        this.lat = lat || 0;
        this.lng = lng || 0;
    }
}
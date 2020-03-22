import { IPosition } from './position.interface';
import { ICapability } from './capability.interfae';
import { Address } from 'models/class/address';
export interface IProfile {
    name?: string;
    surName?: string;
    address?: Address;
    phone?: string;
    skypeId?: string;
    isAvailable?: boolean;
    capabilities?: ICapability[];
    position?: IPosition;
    photoURL?: string;
    isHelper?: boolean;
    id?: string;
}
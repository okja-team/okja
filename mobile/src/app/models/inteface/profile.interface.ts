import { IPosition } from './position.interface';
import { ICapability } from './capability.interfae';
export interface IProfile {
    name?: string;
    surName?: string;
    address?: string;
    phone?: string;
    skypeId?: string;
    isAvailable?: boolean;
    capabilities?: ICapability[];
    position?: IPosition;
    photoURL?: string;
    isHelper?: boolean;
    id?: string;
}
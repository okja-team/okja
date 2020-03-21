import { Roles } from 'models/enums/roles.enum';

export interface ICapability {
    type: Roles;
    available: boolean;
}
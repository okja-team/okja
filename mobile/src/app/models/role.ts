import { RoleType } from './role.enum';

export interface Role {
    // id?: string;
    type: RoleType;
    active: boolean;
}
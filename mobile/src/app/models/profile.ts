import { Role } from './role';
import { RoleType } from './role.enum';

export class Profile {

    constructor() {
        this.id = null;
        this.name = '';
        this.phone = '+39';
        this.surname = '';
        this.address = '';
        this.published = false;
        Object.values(RoleType).forEach(v => {
            this.activity.push({ type: v, active: false });
        })
        this.position = '';
    }

    id: string;
    name: string;
    surname: string;
    address: string;
    phone: string;
    published: boolean;
    activity: Role[] = [];
    position: any;
}
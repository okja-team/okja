import { Role } from './role';
import { RoleType } from './role.enum';

export class Profile {

    constructor(
        public name?: string,
        public surName?: string,
        public address?: string,
        public phone?: string,
        public published?: boolean,
        public activity?: Role[],
        public position?: any,
        public id?: string
    ) {
        this.id = this.id || null;
        this.name = this.name || '';
        this.phone = this.phone || '+39';
        this.published = this.published || false;
        this.activity = this.activity || [];
        Object.values(RoleType).forEach(roleType => {
            if (!this.activity.find(act => act.type === roleType)) {
                this.activity.push({ type: roleType, active: false });
            }
        });
        this.position = this.position || '';
    }
}

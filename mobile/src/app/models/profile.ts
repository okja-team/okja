import { Role } from './role';
import { RoleType } from './role.enum';
import { User } from 'services/user-data/user.interface';

export class Profile {

    constructor(
        public name?: string,
        public surName?: string,
        public address?: string,
        public phone?: string,
        public published?: boolean,
        public activity?: Role[],
        public position?: { lat: string, lng: string },
        public id?: string
    ) {
        this.id = this.id || null;
        this.name = this.name || '';
        this.surName = this.surName || '';
        this.address = this.address || '';
        this.phone = this.phone || '+39';
        this.published = this.published || false;
        this.activity = this.activity || [];
        this.position = this.position || { lat: '', lng: '' };
        Object.values(RoleType).forEach(roleType => {
            if (!this.activity.find(act => act.type === roleType)) {
                this.activity.push({ type: roleType, active: false });
            }
        });
    }

    public setProfileByUser(user: User) {
        if (user) {
            user.displayName.split(' ').forEach((partialName, index) => {
                index === 0 ? this.name = partialName : this.surName += partialName + ' ';
            });
            this.phone = user.phoneNumber || '+39';
        }
    }
}

import { Role } from './role';
import { RoleType } from './role.enum';
import { User } from '../services/user-data/user.interface';

export class Profile {

    constructor(
        public name?: string,
        public surName?: string,
        public address?: string,
        public phone?: string,
        public published?: boolean,
        public activity?: Role[],
        public position?: { lat: string, lng: string },
        public photoURL?: string,
        public id?: string
    ) {
        this.id = id || null;
        this.name = name || '';
        this.surName = surName || '';
        this.address = address || '';
        this.phone = phone || '+39';
        this.published = published || false;
        this.photoURL = photoURL || '';
        this.position = position || { lat: '', lng: '' };
        if (activity) {
            this.activity = activity;
        } else {
            {
                this.activity = [];
                Object.values(RoleType).forEach(roleType => {
                    this.activity.push({ type: roleType, active: false });
                });
            }
        }
    }

    public setProfileByUser(user: User) {
        if (user) {
            this.id = user.uid;
            user.displayName.split(' ').forEach((partialName, index) => {
                index === 0 ? this.name = partialName : this.surName += partialName + ' ';
            });
            this.phone = user.phoneNumber || '+39';
            this.photoURL = user.photoURL || '';
            // Object.values(RoleType).forEach(roleType => {
            //     this.activity.push({ type: roleType, active: false });
            // });
        }
    }
}


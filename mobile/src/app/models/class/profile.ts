
import { Roles } from '../enums/roles.enum';
import { IPosition } from 'models/inteface/position.interface';
import { ICapability } from 'models/inteface/capability.interfae';
import { IProfile } from 'models/inteface/profile.interface';

export class Profile implements IProfile {


    constructor(
        public name?: string,
        public surName?: string,
        public address?: string,
        public phone?: string,
        public skypeId?: string,
        public isAvailable = true,
        public capabilities?: ICapability[],
        public position?: IPosition,
        public photoURL?: string,
        public isHelper = true,
        public id?: string
    ) {
        this.id = id || null;
        this.name = name || '';
        this.surName = surName || '';
        this.address = address || '';
        this.phone = phone || '+39';
        this.skypeId = skypeId || '';
        this.isAvailable = isAvailable;
        this.photoURL = photoURL || '';
        this.position = position ||
        {
            lat: this.position && this.position.lat || '',
            lng: this.position && this.position.lng || ''
        };
        this.isHelper = isHelper;
        if (capabilities) {
            this.capabilities = capabilities;
        } else {
            this.capabilities = [];
            Object.values(Roles).forEach(roleType => {
                this.capabilities.push({ type: roleType, available: true });

            });
        }
    }
}

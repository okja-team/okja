
import { Position } from './profile-position';
import { Roles } from '../enums/roles.enum';

export class Profile {
    id: string;
    nome: string;
    cognome: string;
    indirizzo: string;
    contatto: string;
    capabilities: Map<Roles, boolean>;

    isHelper: boolean;

    published: boolean;

    position: Position;

    constructor() {
        this.initCapabilities();
        this.isHelper = false;
        this.published = false;
    }

    public setCapability(aiuto: Roles, value: boolean): void{
        this.capabilities.set(aiuto, value);
    }

    public getCapability(aiuto: Roles): boolean {
        return this.capabilities.get(aiuto);
    }

    public isProfileValid(): boolean {
        return !!this.nome && !!this.cognome && !!this.indirizzo && !!this.contatto && !!this.position &&
            typeof this.isHelper !== "undefined";
    }

    private initCapabilities(): void {
        this.capabilities = new Map<Roles, boolean>();
        this.capabilities.set(Roles.Spesa, false);
        this.capabilities.set(Roles.Posta, false);
        this.capabilities.set(Roles.Farmacia, false);
        this.capabilities.set(Roles.Compagnia, false);
    }
}
import { Aiuti } from '../enums/aiuti.enum';
import { Position } from './profile-position';

export class Profile {
    id: string;
    nome: string;
    cognome: string;
    indirizzo: string;
    contatto: string;
    capabilities: Map<Aiuti,boolean>;

    isHelper: boolean;

    published: boolean;

    position: Position

    constructor() {
        this.initCapabilities();
        this.isHelper = false;
        this.published = false;
    }

    public setCapability(aiuto: Aiuti, value: boolean): void{
        this.capabilities.set(aiuto, value);
    }

    public getCapability(aiuto: Aiuti): boolean {
        return this.capabilities.get(aiuto);
    }

    public isProfileValid(): boolean {
        return !!this.nome && !!this.cognome && !!this.indirizzo && !!this.contatto && !!this.position &&
            typeof this.isHelper !== "undefined";
    }

    private initCapabilities(): void {
        this.capabilities = new Map<Aiuti, boolean>();
        this.capabilities.set(Aiuti.Spesa, false);
        this.capabilities.set(Aiuti.Posta, false);
        this.capabilities.set(Aiuti.Farmacia, false);
        this.capabilities.set(Aiuti.Compagnia, false);
    }
}
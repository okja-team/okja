import { Aiuti } from '../enums/aiuti.enum';

export class User {
    nome: string;
    cognome: string;
    indirizzo: string;
    contatto: string;
    capabilities: Map<Aiuti,boolean>;

    constructor() {
        this.initCapabilities();
    }

    setCapability(aiuto: Aiuti, value: boolean): void{
        this.capabilities.set(aiuto, value);
    }

    getCapability(aiuto: Aiuti): boolean {
        return this.capabilities.get(aiuto);
    }

    private initCapabilities(): void {
        this.capabilities = new Map<Aiuti, boolean>();
        this.capabilities.set(Aiuti.Spesa, false);
        this.capabilities.set(Aiuti.Posta, false);
        this.capabilities.set(Aiuti.Farmacia, false);
        this.capabilities.set(Aiuti.Compagnia, false);
    }
}
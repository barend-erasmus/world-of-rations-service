// Imports models
import { Feedstuff } from './feedstuff';

export class FormulationFeedstuff extends Feedstuff {
    constructor(id: string, name: string, public cost: number, public weight: number) {
        super(id, name);
    }
}
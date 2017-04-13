// Imports domain models
import { FormulaMeasurement as DomainFormulaMeasurement } from './formula-measurement';

export class Formula {
    public elements: DomainFormulaMeasurement[] = [];

    constructor(public id: string, public name: string) {
    }
}

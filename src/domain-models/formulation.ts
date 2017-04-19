// Imports models
import { FormulationFeedstuff } from './formulation-feedstuff';
import { Formula } from './formula';

export class Formulation {
    constructor(
        public id: string,
        public feasible: boolean,
        public cost: number,
        public currencyCode: string,
        public formula: Formula,
        public feedstuffs: FormulationFeedstuff[],
        public username: string
    ) {

    }
}
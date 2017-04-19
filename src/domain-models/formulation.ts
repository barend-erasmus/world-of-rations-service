// Imports models
import { Formula } from './formula';
import { FormulationFeedstuff } from './formulation-feedstuff';

export class Formulation {
    constructor(
        public id: string,
        public feasible: boolean,
        public cost: number,
        public currencyCode: string,
        public formula: Formula,
        public feedstuffs: FormulationFeedstuff[],
        public username: string,
    ) {

    }
}

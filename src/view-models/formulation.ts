// Imports models
import { CompositionElement } from './composition-element';
import { Formula } from './formula';
import { FormulationFeedstuff } from './formulation-feedstuff';
import { SupplementElement } from './supplement-element';

export class Formulation {
    constructor(
        public id: string,
        public feasible: boolean,
        public currencyCode: string,
        public cost: number,
        public feedstuffs: FormulationFeedstuff[],
        public formula: Formula,
        public composition: CompositionElement[],
        public supplementElements: SupplementElement[]) {

    }
}

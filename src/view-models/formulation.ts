// Imports models
import { CompositionElement } from './composition-element';
import { Formula } from './formula';
import { FormulationFeedstuff } from './formulation-feedstuff';
import { SupplementElement } from './supplement-element';

export class Formulation {

    public static mapFormulation(obj: any): Formulation {
        return new Formulation(
            obj.id,
            obj.feasible,
            obj.cost,
            obj.currencyCode,
            Formula.mapFormula(obj.formula),
            Formula.mapFormula(obj.comparisonFormula),
            obj.feedstuffs.map((x) => FormulationFeedstuff.mapFormulationFeedstuff(x)),
            obj.supplementElements.map((x) => SupplementElement.mapSupplementElement(x)),
            obj.composition,
            obj.username,
            obj.timestamp);
    }

    constructor(
        public id: string,
        public feasible: boolean,
        public cost: number,
        public currencyCode: string,
        public formula: Formula,
        public comparisonFormula: Formula,
        public feedstuffs: FormulationFeedstuff[],
        public supplementElements: SupplementElement[],
        public composition: CompositionElement[],
        public username: string,
        public timestamp: number,
    ) {

    }
}

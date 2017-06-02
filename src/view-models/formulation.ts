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
        public username: string,
        public timestamp: number,
    ) {

    }

    public GetComposition(): CompositionElement[] {
        const composition: CompositionElement[] = [];

        for (const element of this.comparisonFormula.elements) {
            let elementMinimum = element.minimum == null ? 0 : element.minimum;
            let elementMaximum = element.maximum == null ? 1000000 : element.maximum;

            let sum = 0;
            for (const feedstuff of this.feedstuffs) {
                const feedstuffElements = feedstuff.elements.filter((x) => x.id === element.id);
                if (feedstuffElements.length > 0 && feedstuff.weight !== undefined) {
                    sum += feedstuffElements[0].value * feedstuff.weight;
                }
            }

            sum = sum / 1000;

            elementMinimum = element.minimum === null ? 0 : element.minimum;
            elementMaximum = element.maximum === null ? 1000000 : element.maximum;

            const sortageValue = (element.minimum * 1000) - (sum * 1000);
            const status = (Math.round(sum * 100) / 100) < elementMinimum ? 'Inadequate' : (Math.round(sum * 100) / 100) > elementMaximum ? 'Excessive' : 'Adequate';

            composition.push(new CompositionElement(element.id, element.name, element.unit, element.sortOrder, sum, status, sortageValue));
        }

        return composition;
    }

    public GetCompositionElementForSupplementElements() {
        return this.GetComposition().filter((x) => x.hasSortage());
    }
}

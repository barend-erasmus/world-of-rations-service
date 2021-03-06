// Imports models
import { CompositionElement } from './composition-element';
import { Formula } from './formula';
import { FormulationFeedstuff } from './formulation-feedstuff';
import { SupplementElement } from './supplement-element';

// Imports view models
import { Formulation as ViewModelFormulation } from './../view-models/formulation';

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

    public getComposition(): CompositionElement[] {
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

    public getCompositionElementForSupplementElements() {
        return this.getComposition().filter((x) => x.hasSortage());
    }

    public isValid(): boolean {

        if (!this.id) {
            return false;
        }

        if (!this.currencyCode) {
            return false;
        }

        if (!this.formula) {
            return false;
        }

        if (!this.formula.isValid()) {
            return false;
        }

        if (!this.comparisonFormula) {
            return false;
        }

        if (!this.comparisonFormula.isValid()) {
            return false;
        }

        if (!this.feedstuffs) {
            return false;
        }

        if (this.feedstuffs.filter((x) => !x.isValid()).length > 0) {
            return false;
        }

        if (!this.supplementElements) {
            return false;
        }

        if (this.supplementElements.filter((x) => !x.isValid()).length > 0) {
            return false;
        }

        if (!this.timestamp) {
            return false;
        }

        return true;
    }

    public toViewModelFormulation(): ViewModelFormulation {
        return new ViewModelFormulation(this.id, this.feasible, this.cost, this.currencyCode, this.formula.toViewModelFormula(), this.comparisonFormula.toViewModelFormula(), this.feedstuffs.map((x) => x.toViewModelFormulationFeedstuff()), this.supplementElements.map((x) => x.toViewModelSupplementElement()), this.getComposition().map((x) => x.toViewModelCompositionElement()), this.username, this.timestamp)
    }
}

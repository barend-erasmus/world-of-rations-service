// Imports domain models
import { CompositionElement as DomainCompositionElement } from './composition-element';
import { Feedstuff as DomainFeedstuff } from './feedstuff';
import { Formula as DomainFormula } from './formula';
import { SupplementElement as DomainSupplementElement } from './supplement-element';

// Imports data models
import { Formulation as DataFormulation } from './../data-models/formulation';
import { FormulationFeedstuff as DataFormulationFeedstuff } from './../data-models/formulation-feedstuff';

export class Formulation {
    public feedstuffs: DomainFeedstuff[] = null;
    public composition: DomainCompositionElement[] = null;
    public formula: DomainFormula = null;
    public feasible: boolean = null;
    public cost: number = null;
    public currencyCode: string = null;
    public supplementComposition: DomainSupplementElement[] = null;

    constructor(public id: string) {

    }

    public toDataFormulation() {
        return new DataFormulation(this.id, this.formula.id, null, this.feasible, this.cost, this.currencyCode, new Date().getTime());
    }

    public toDataFormulationFeedstuffs() {
        return this.feedstuffs.map((x) => new DataFormulationFeedstuff(this.id, x.id, x.name, x.minimum, x.maximum, x.cost, x.weight));
    }
}

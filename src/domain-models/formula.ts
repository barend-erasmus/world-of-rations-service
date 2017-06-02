// Imports models
import { FormulaElement } from './formula-element';
import { FormulaGroup } from './formula-group';

// Imports view models
import { Formula as ViewModelFormula } from './../view-models/formula';

export class Formula {

    public static mapFormula(obj: any) {
        return new Formula(obj.id, obj.name, obj.group === null ? null : FormulaGroup.mapFormulaGroup(obj.group), obj.elements.map((x) => new FormulaElement(x.id, x.name, x.unit, x.sortOrder, x.minimum, x.maximum)), obj.comparisonFormulaId);
    }

    constructor(
        public id: string,
        public name: string,
        public group: FormulaGroup,
        public elements: FormulaElement[],
        public comparisonFormulaId: string,
    ) {

    }

    public fullname() {
        return `${this.group.name} - ${this.name}`;
    }

    public toViewModelFormula(): ViewModelFormula {
        return new ViewModelFormula(this.id, this.name, this.group.toViewModelFormulaGroup(), this.elements.map((x) => x.toViewModelFormulaElement()), this.comparisonFormulaId)
    }
}

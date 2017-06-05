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

    public getGroupByLevel(level: number): FormulaGroup {
        const groups: FormulaGroup[] = [];

        let group = this.group;
        while(group !== null) {
            groups.push(group);
            group = group.parent;
        }

        return groups[groups.length - level - 1];
    }

    public getNumberOfGroupLevels(): number {
        const groups: FormulaGroup[] = [];

        let group = this.group;
        while(group !== null) {
            groups.push(group);
            group = group.parent;
        }

        return groups.length;
    }

    public isValid(): boolean {

        if (!this.id) {
            return false;
        }

        if (!this.name) {
            return false;
        }
        
        if (!this.group) {
            return false;
        }

        if (!this.group.isValid()) {
            return false;
        }

        if (!this.elements) {
            return false;
        }

        if (this.elements.filter((x) => !x.isValid()).length > 0) {
            return false;
        }

        if (!this.comparisonFormulaId) {
            return false;
        }

        return true;
    }

    public toViewModelFormula(excludeElements: boolean = false): ViewModelFormula {
        return new ViewModelFormula(this.id, this.name, this.group.toViewModelFormulaGroup(), excludeElements? null : this.elements.map((x) => x.toViewModelFormulaElement()), this.comparisonFormulaId)
    }
}

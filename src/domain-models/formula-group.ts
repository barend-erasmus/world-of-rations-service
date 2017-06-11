// Imports view models
import { FormulaGroup as ViewModelFormulaGroup } from './../view-models/formula-group'

export class FormulaGroup {

    public static mapFormulaGroup(obj: any): FormulaGroup {
        return new FormulaGroup(obj.id, obj.name, obj.parent === null ? null : FormulaGroup.mapFormulaGroup(obj.parent));
    }

    constructor(
        public id: string,
        public name: string,
        public parent: FormulaGroup
    ) {

    }

    public isValid(): boolean {

        if (!this.id) {
            return false;
        }

        if (!this.name) {
            return false;
        }

        if (this.parent) {
            if (!this.parent.isValid()) {
                return false;
            }
        }

        return true;
    }

    public toViewModelFormulaGroup(): ViewModelFormulaGroup {
        return new ViewModelFormulaGroup(this.id, this.name, this.parent === null ? null : this.parent.toViewModelFormulaGroup())
    }
}

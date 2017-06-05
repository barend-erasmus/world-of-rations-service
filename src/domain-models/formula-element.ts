// Imports models
import { Element } from './element';

// Imports view models
import { FormulaElement as ViewModelFormulaElement} from './../view-models/formula-element';

export class FormulaElement extends Element {
    constructor(
        id: string,
        name: string,
        unit: string,
        sortOrder: number,
        public minimum: number,
        public maximum: number,
    ) {
        super(id, name, unit, null, sortOrder);
    }

    public isValid() : boolean {
        if (!this.id) {
            return false;
        }

        if (!this.name) {
            return false;
        } 

        if (!this.unit) {
            return false;
        }

        if (!this.sortOrder) {
            return false;
        }

        return true;
    }

    public toViewModelFormulaElement(): ViewModelFormulaElement {
        return new ViewModelFormulaElement(this.id, this.name, this.unit, this.sortOrder, this.minimum, this.maximum);
    }
}

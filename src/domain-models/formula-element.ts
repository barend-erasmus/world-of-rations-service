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

    public toViewModelFormulaElement(): ViewModelFormulaElement {
        return new ViewModelFormulaElement(this.id, this.name, this.unit, this.sortOrder, this.minimum, this.maximum);
    }
}

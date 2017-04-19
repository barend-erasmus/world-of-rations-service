// Imports models
import { Element } from './element';

export class FormulaElement extends Element {
    constructor(
        id: string,
        name: string,
        unit: string,
        sortOrder: number,
        public minimum: number,
        public maximum: number,
    ) {
        super(id, name, unit, sortOrder);
    }
}

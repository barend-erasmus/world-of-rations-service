// Imports models
import { Element } from './element';

export class CompositionElement extends Element {
    constructor(
        id: string,
        name: string,
        unit: string,
        sortOrder: number,
        public value: number,
        public status: string
    ) {
        super(id, name, unit, sortOrder);
    }
}
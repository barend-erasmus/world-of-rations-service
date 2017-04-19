// Imports models
import { Element } from './element';

export class FeedstuffElement extends Element {
    constructor(
        id: string,
        name: string,
        unit: string,
        sortOrder: number,
        public value: number,
    ) {
        super(id, name, unit, sortOrder);
    }
}
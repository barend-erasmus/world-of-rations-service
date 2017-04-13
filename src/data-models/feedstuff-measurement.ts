// Imports data models
import { Element as DataElement } from './element';

export class FeedstuffMeasurement extends DataElement {
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

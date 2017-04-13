// Imports data models
import { Feedstuff as DataFeedstuff } from './feedstuff';

export class ExampleFeedstuff extends DataFeedstuff {
    constructor(
        id: string,
        name: string,
        public minimum: number,
        public maximum: number,
        public cost: number,
    ) {
        super(id, name);
    }
}

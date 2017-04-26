// Imports models
import { Feedstuff } from './feedstuff';

export class ExampleFeedstuff extends Feedstuff {
    constructor(id: string, name: string, public cost: number, public minimum: number, public maximum: number) {
        super(id, name);
    }
}

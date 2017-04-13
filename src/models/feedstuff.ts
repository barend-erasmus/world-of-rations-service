// Imports domain models
import { FeedstuffMeasurement as DomainFeedstuffMeasurement } from './feedstuff-measurement';

export class Feedstuff {
    public weight: number = null;
    public elements: DomainFeedstuffMeasurement[] = [];

    constructor(
        public id: string,
        public name: string,
        public minimum: number,
        public maximum: number,
        public cost: number,
    ) {
    }
}

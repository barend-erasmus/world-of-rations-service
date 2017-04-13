// Imports domain models
import { SupplementFeedstuff as DomainSupplementFeedstuff } from './supplement-feedstuff';

export class Element {
    public selectedSupplementFeedstuffs: DomainSupplementFeedstuff[];
    public supplementFeedstuffs: DomainSupplementFeedstuff[];

    constructor(
        public id: string,
        public name: string,
        public minimum: number,
        public maximum: number,
        public value: number,
        public unit: string,
        public sortOrder: number,
    ) {
    }
}

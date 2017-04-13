// Imports domain models
import { SupplementFeedstuff as DomainSupplementFeedstuff } from './supplement-feedstuff';

export class SupplementElement {
    public selectedSupplementFeedstuffs: DomainSupplementFeedstuff[];
    public supplementFeedstuffs: DomainSupplementFeedstuff[];

    constructor(public id: string, public name: string, public unit: string, public sortOrder: number) {
    }
}

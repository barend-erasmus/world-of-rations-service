// Imports domain models
import { SupplementFeedstuff } from './supplement-feedstuff';

export class SupplementElement {
    public selectedSupplementFeedstuff: SupplementFeedstuff;
    public supplementFeedstuffs: SupplementFeedstuff[];

    constructor(public id: string, public name: string, public unit: string, public sortOrder: number) {
    }
}

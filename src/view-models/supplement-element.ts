// Imports models
import { SupplementFeedstuff } from './supplement-feedstuff';

export class SupplementElement {
    constructor(public id: string, public name: string, public unit: string, public sortOrder: number, public selectedSupplementFeedstuff: SupplementFeedstuff[], public supplementFeedstuffs: SupplementFeedstuff[]) {

    }
}

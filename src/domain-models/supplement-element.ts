// Imports models
import { SupplementFeedstuff } from './supplement-feedstuff';

export class SupplementElement {

    public static mapSupplementElement(obj: any): SupplementElement {
        const result = new SupplementElement(obj.id, obj.name, obj.unit, obj.sortOrder);
        result.selectedSupplementFeedstuff = SupplementFeedstuff.mapSupplementFeedstuff(obj.selectedSupplementFeedstuff);
        result.supplementFeedstuffs = obj.supplementFeedstuffs.map((x) => SupplementFeedstuff.mapSupplementFeedstuff(x));
        return result;
    }

    public selectedSupplementFeedstuff: SupplementFeedstuff;
    public supplementFeedstuffs: SupplementFeedstuff[];

    constructor(public id: string, public name: string, public unit: string, public sortOrder: number) {
    }
}

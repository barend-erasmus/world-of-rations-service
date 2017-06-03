// Imports models
import { SupplementFeedstuff } from './supplement-feedstuff';

// Imports view models
import { SupplementElement as ViewModelSupplementElement } from './../view-models/supplement-element';

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

    public toViewModelSupplementElement(): ViewModelSupplementElement {
        return new ViewModelSupplementElement(this.id, this.name, this.unit, this.sortOrder);
    }
}

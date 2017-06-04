// Imports models
import { SupplementFeedstuff } from './supplement-feedstuff';

// Imports view models
import { SupplementElement as ViewModelSupplementElement } from './../view-models/supplement-element';

export class SupplementElement {

    public static mapSupplementElement(obj: any): SupplementElement {
        const result = new SupplementElement(obj.id, obj.name, obj.unit, obj.sortOrder);
        result.supplementFeedstuffs = obj.supplementFeedstuffs.map((x) => SupplementFeedstuff.mapSupplementFeedstuff(x));
        return result;
    }

    public supplementFeedstuffs: SupplementFeedstuff[];

    constructor(public id: string, public name: string, public unit: string, public sortOrder: number) {
    }

    public isValid(): boolean {

        if (!this.id) {
            return false;
        }

        if (!this.name) {
            return false;
        }

        if (!this.unit) {
            return false;
        }

        if (!this.sortOrder) {
            return false;
        }

        return true;
    }

    public toViewModelSupplementElement(): ViewModelSupplementElement {
        const supplementFeedstuffs = this.supplementFeedstuffs.map((x) => x.toViewModelSupplementFeedstuff());

        const supplementElement = new ViewModelSupplementElement(this.id, this.name, this.unit, this.sortOrder);

        supplementElement.supplementFeedstuffs = supplementFeedstuffs;

        return supplementElement;
    }
}

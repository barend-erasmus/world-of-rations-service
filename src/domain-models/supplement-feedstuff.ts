// Imports view models
import { SupplementFeedstuff as ViewModelSupplementFeedstuff } from './../view-models/supplement-feedstuff';

export class SupplementFeedstuff {

    public static mapSupplementFeedstuff(obj: any): SupplementFeedstuff {
        return new SupplementFeedstuff(obj.id, obj.text, obj.weight);
    }

    constructor(public id: string, public text: string, public weight: number) {
    }

    public isValid(): boolean {

        if (!this.id) {
            return false;
        }

        if (!this.text) {
            return false;
        }

        if (!this.weight) {
            return false;
        }
        
        return true;
    }

    public toViewModelSupplementFeedstuff(): ViewModelSupplementFeedstuff {
        return new ViewModelSupplementFeedstuff(this.id, this.text, this.weight);
    }
}

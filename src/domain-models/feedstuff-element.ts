// Imports models
import { Element } from './element';

// Import view models
import { FeedstuffElement as ViewModelFeedstuffElement} from './../view-models/feedstuff-element';

export class FeedstuffElement extends Element {
    constructor(
        id: string,
        name: string,
        unit: string,
        code: string,
        sortOrder: number,
        public value: number,
    ) {
        super(id, name, unit, code, sortOrder);
    }

    public isValid() : boolean {
        if (!this.id) {
            return false;
        }

        if (!this.name) {
            return false;
        } 

        if (!this.unit) {
            return false;
        }

        if (!this.code) {
            return false;
        }

        if (!this.sortOrder) {
            return false;
        }

        return true;
    }

    public toViewModelFeedstuffElement(): ViewModelFeedstuffElement {
        return new ViewModelFeedstuffElement(this.id, this.name, this.unit, this.code, this.sortOrder, this.value);
    }
}

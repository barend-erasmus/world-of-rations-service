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

    public toViewModelFeedstuffElement(): ViewModelFeedstuffElement {
        return new ViewModelFeedstuffElement(this.id, this.name, this.unit, this.code, this.sortOrder, this.value);
    }
}

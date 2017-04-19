// Imports models
import { FeedstuffElement } from './feedstuff-element';
import { FeedstuffGroup } from './feedstuff-group';

export class Feedstuff {
    constructor(
        public id: string,
        public name: string,
        public group: FeedstuffGroup,
        public elements: FeedstuffElement[],
        public username: string,
    ) {

    }
}

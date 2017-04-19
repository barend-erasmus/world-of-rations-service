// Imports models
import { FeedstuffElement } from './feedstuff-element';
import { FeedstuffGroup } from './feedstuff-group';
import { Feedstuff } from './feedstuff';

export class FormulationFeedstuff extends Feedstuff {
    constructor(
        id: string,
        name: string,
        group: FeedstuffGroup,
        elements: FeedstuffElement[],
        username: string, 
        public cost: number,
        public minimum: number,
        public maximum: number,
        public weight: number
    ) {
        super(id, name, group, elements, username);
    }
}
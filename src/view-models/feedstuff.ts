// Imports models
import { FeedstuffElement } from './feedstuff-element';
import { FeedstuffGroup } from './feedstuff-group';

export class Feedstuff {

    public static mapFeedstuff(obj: any) {
        return new Feedstuff(obj.id, obj.name, obj.group === null ? null : FeedstuffGroup.mapFeedstuffGroup(obj.group), obj.elements.map((x) => new FeedstuffElement(x.id, x.name, x.unit, x.code, x.sortOrder, x.value)), obj.username);
    }

    constructor(
        public id: string,
        public name: string,
        public group: FeedstuffGroup,
        public elements: FeedstuffElement[],
        public username: string,
    ) {

    }
}

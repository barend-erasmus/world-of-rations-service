// Import view models
import { FeedstuffGroup as ViewModelFeedstuffGroup } from './../view-models/feedstuff-group';

export class FeedstuffGroup {

    public static mapFeedstuffGroup(obj: any): FeedstuffGroup {
        return new FeedstuffGroup(obj.id, obj.name);
    }

    constructor(
        public id: string,
        public name: string,
    ) {

    }

    public toViewModelFeedstuffGroup(): ViewModelFeedstuffGroup {
        return new ViewModelFeedstuffGroup(this.id, this.name);
    }
}

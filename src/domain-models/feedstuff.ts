// Imports models
import { FeedstuffElement } from './feedstuff-element';
import { FeedstuffGroup } from './feedstuff-group';

// Import view models
import { Feedstuff as ViewModelFeedstuff } from './../view-models/feedstuff';

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

    public isUserFeedstuff() {
        return this.username != null;
    }

    public isValid() {
        if (!this.id) {
            return false;
        }

        if (!this.name) {
            return false;
        }

        if (!this.elements) {
            return false;
        }

        if (this.elements.filter((x) => !x.isValid()).length > 0) {
            return false;
        }

        if (this.isUserFeedstuff()) {
            if (!this.username) {
                return false;
            }

            if (this.group) {
                return false;
            }
        } else {
            if (!this.group) {
                return false;
            }

            if (!this.group.isValid()) {
                return false;
            }
        }

        return true;
    }

    public toViewModelFeedstuff(): ViewModelFeedstuff {
        return new ViewModelFeedstuff(this.id, this.name, this.group == null? null : this.group.toViewModelFeedstuffGroup(), this.elements.map((x) => x.toViewModelFeedstuffElement()), this.username);
    }
}

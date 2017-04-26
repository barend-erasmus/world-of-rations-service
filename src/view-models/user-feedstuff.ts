// Imports models
import { FeedstuffElement } from './feedstuff-element';

export class UserFeedstuff {
    constructor(public id: string, public name: string, public elements: FeedstuffElement[]) {

    }
}

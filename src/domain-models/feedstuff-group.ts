export class FeedstuffGroup {

    public static mapFeedstuffGroup(obj: any): FeedstuffGroup {
        return new FeedstuffGroup(obj.id, obj.name);
    }

    constructor(
        public id: string,
        public name: string,
    ) {

    }
}

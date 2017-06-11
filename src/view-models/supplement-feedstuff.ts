export class SupplementFeedstuff {

    public static mapSupplementFeedstuff(obj: any): SupplementFeedstuff {
        return new SupplementFeedstuff(obj.id, obj.text, obj.weight);
    }

    constructor(public id: string, public text: string, public weight: number) {
    }
}

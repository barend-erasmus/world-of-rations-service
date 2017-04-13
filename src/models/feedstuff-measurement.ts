export class FeedstuffMeasurement {
    constructor(
        public id: string,
        public name: string,
        public value: number,
        public unit: string,
        public sortOrder: number,
    ) {
    }
}

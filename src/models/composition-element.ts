export class CompositionElement {
    constructor(
        public id: string,
        public name: string,
        public minimum: number,
        public maximum: number,
        public value: number,
        public unit: string,
        public sortOrder: number,
    ) {
    }
}

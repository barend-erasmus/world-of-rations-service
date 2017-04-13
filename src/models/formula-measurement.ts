export class FormulaMeasurement {
    constructor(
        public id: string,
        public name: string,
        public minimum: number,
        public maximum: number,
        public unit: string,
        public sortOrder: number,
    ) {
    }
}

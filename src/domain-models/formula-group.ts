export class FormulaGroup {

    public static mapFormulaGroup(obj: any): FormulaGroup {
        return new FormulaGroup(obj.id, obj.name);
    }

    constructor(
        public id: string,
        public name: string,
    ) {

    }
}

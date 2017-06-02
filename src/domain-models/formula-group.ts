export class FormulaGroup {

    public static mapFormulaGroup(obj: any): FormulaGroup {
        return new FormulaGroup(obj.id, obj.name, obj.parent === null? null : FormulaGroup.mapFormulaGroup(obj.parent));
    }

    constructor(
        public id: string,
        public name: string,
        public parent: FormulaGroup
    ) {

    }
}

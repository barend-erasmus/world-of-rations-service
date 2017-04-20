// Imports models
import { FormulaElement } from './formula-element';
import { FormulaGroup } from './formula-group';

export class Formula {
     constructor(
        public id: string,
        public name: string,
        public group: FormulaGroup,
        public elements: FormulaElement[],
        public comparisonFormulaId: string,
    ) {

    }
}

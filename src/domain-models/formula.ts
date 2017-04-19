// Imports models
import { FormulaGroup } from './formula-group'
import { FormulaElement } from './formula-element'

export class Formula {
     constructor(
        public id: string,
        public name: string,
        public group: FormulaGroup,
        public elements: FormulaElement[]
    ) {

    }
}
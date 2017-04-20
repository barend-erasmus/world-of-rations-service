// Imports
import * as co from 'co';
import { Base } from './base';

// Imports models
import { Formula } from './../../domain-models/formula';
import { FormulaElement } from './../../domain-models/formula-element';
import { FormulaGroup } from './../../domain-models/formula-group';

// Imports repositories
import { IFormulaRepository } from './../formula';

export class FormulaRepository extends Base implements IFormulaRepository {

    constructor(config: any) {
        super(config);
    }

    public list(): Promise<Formula[]> {
        const self = this;

        return co(function*(){
            const result: any[] = yield self.query(`CALL listFormulas();`);

            const formulas: Formula[] = yield result.map((x) => self.loadElements(new Formula(x.id, x.name, x.groupId === null?  null:  new FormulaGroup(x.groupId, x.groupName), null, x.comparisonFormulaId)));
            return formulas;
        });
    }

    public create(formula: Formula): Promise<boolean> {
        const self = this;

        return co(function*() {

            const insertFormulaResult: any = yield self.query(`CALL insertFormula('${formula.id}', '${formula.name}', '${formula.group.id}');`);

            const insertFormulaElementResults: any[] = yield formula.elements.map((x) => self.query(`CALL insertFormulaElement('${formula.id}', '${x.id}', ${x.minimum}, ${x.maximum})`));

            return true;
        });
    }

    public update(formula: Formula): Promise<boolean> {
        const self = this;

        return co(function*() {
            const insertFormulaResult: any = yield self.query(`CALL updateFeedstuff('${formula.id}', '${formula.name}', '${formula.group.id}');`);

            const insertFormulaElementResults: any[] = yield formula.elements.map((x) => self.query(`CALL updateFeedstuffElement('${formula.id}', '${x.id}', ${x.minimum}, ${x.maximum})`));

            return true;
        });
    }

    public findById(id: string): Promise<Formula> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL findFormulaById('${id}');`);

            if (result.length === 0) {
                return null;
            }

            const group: FormulaGroup = result[0].groupId === null? null : new FormulaGroup(result[0].groupId, result[0].groupName);

            let formula: Formula = new Formula(result[0].id, result[0].name, group, null, result[0].comparisonFormulaId);

            formula = yield self.loadElements(formula);

            return formula;
        });
    }

    private loadElements(formula: Formula) {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL listFormulaElementsById('${formula.id}');`);

            formula.elements = result.map((x) => new FormulaElement(x.id, x.name, x.unit, x.sortOrder, x.minimum, x.maximum));

            return formula;
        });
    }

}

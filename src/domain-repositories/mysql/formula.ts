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

        return co(function*() {
            const result: any[] = yield self.query(`CALL listFormulas();`, true);

            const formulas: Formula[] = yield result.map((x) => self.loadElements(
                new Formula(x.id, x.name,
                    x.groupId1 === null ? null : new FormulaGroup(x.groupId1, x.groupName1,
                        x.groupId2 === null ? null : new FormulaGroup(x.groupId2, x.groupName2,
                            x.groupId3 === null ? null : new FormulaGroup(x.groupId3, x.groupName3,
                                x.groupId4 === null ? null : new FormulaGroup(x.groupId4, x.groupName4, null)))),
                    null, x.comparisonFormulaId), true)
            );
            return formulas;
        });
    }

    public create(formula: Formula): Promise<boolean> {
        const self = this;

        return co(function*() {

            const insertFormulaResult: any = yield self.query(`CALL insertFormula('${formula.id}', '${formula.name}', '${formula.group.id}');`, false);

            const insertFormulaElementResults: any[] = yield formula.elements.map((x) => self.query(`CALL insertFormulaElement('${formula.id}', '${x.id}', ${x.minimum}, ${x.maximum})`, false));

            return true;
        });
    }

    public update(formula: Formula): Promise<boolean> {
        const self = this;

        return co(function*() {
            const insertFormulaResult: any = yield self.query(`CALL updateFeedstuff('${formula.id}', '${formula.name}', '${formula.group.id}');`, false);

            const insertFormulaElementResults: any[] = yield formula.elements.map((x) => self.query(`CALL updateFeedstuffElement('${formula.id}', '${x.id}', ${x.minimum}, ${x.maximum})`, false));

            return true;
        });
    }

    public findById(id: string): Promise<Formula> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL findFormulaById('${id}');`, true);

            if (result.length === 0) {
                return null;
            }

            const group: FormulaGroup = result[0].groupId1 === null ? null : new FormulaGroup(result[0].groupId1, result[0].groupName1,
                result[0].groupId2 === null ? null : new FormulaGroup(result[0].groupId2, result[0].groupName2,
                    result[0].groupId3 === null ? null : new FormulaGroup(result[0].groupId3, result[0].groupName3,
                        result[0].groupId4 === null ? null : new FormulaGroup(result[0].groupId4, result[0].groupName4, null))));

            let formula: Formula = new Formula(result[0].id, result[0].name, group, null, result[0].comparisonFormulaId);

            formula = yield self.loadElements(formula, true);

            return formula;
        });
    }

    private loadElements(formula: Formula, useCache: boolean) {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL listFormulaElementsById('${formula.id}');`, useCache);

            formula.elements = result.map((x) => new FormulaElement(x.id, x.name, x.unit, x.sortOrder, x.minimum, x.maximum));

            return formula;
        });
    }

}

// Imports
import * as co from 'co';
import * as util from 'util';
import { Base } from './base';

// Imports interfaces
import { IFormulaRepository } from './../formula';

// Imports data models
import { Formula as DataFormula } from './../../data-models/formula';
import { FormulaMeasurement as DataFormulaMeasurement } from './../../data-models/formula-measurement';

// Imports domain models
import { CompositionElement as DomainCompositionElement } from './../../models/composition-element';
import { Formula as DomainFormula } from './../../models/formula';
import { FormulaMeasurement as DomainFormulaMeasurement } from './../../models/formula-measurement';
import { Formulation as DomainFormulation } from './../../models/formulation';

export class FormulaRepository extends Base implements IFormulaRepository {

    constructor(config: any) {
        super(config);
    }

    public listFormulas(): Promise<DomainFormula[]> {
        const self = this;

        return co(function*() {
            const listFormulasResult: DataFormula[] = yield self.query('CALL listFormulas();');

            return listFormulasResult.map((x) => new DomainFormula(x.id, x.name));
        });
    }

    public listElementsByFormulaId(formulaId: string): Promise<DomainFormulaMeasurement[]> {
        const self = this;

        return co(function*() {
            const listElementsForFormulaResult: DataFormulaMeasurement[] = yield self.query(util.format('CALL listElementsForFormula(%s);', self.escapeAndFormat(formulaId)));

            return listElementsForFormulaResult.map((x) => new DomainFormulaMeasurement(x.id, x.name, x.minimum, x.maximum, x.unit, x.sortOrder));
        });
    }

    public findFormulaByFormulaId(formulaId: string): Promise<DomainFormula> {
        const self = this;

        return co(function*() {
            const findFormulaByFormulaIdResult: DataFormula[] = yield self.query(util.format('CALL findFormulaByFormulaId(%s);', self.escapeAndFormat(formulaId)));

            return new DomainFormula(findFormulaByFormulaIdResult[0].id, findFormulaByFormulaIdResult[0].name);
        });
    }

    public findComparisonFormulaByFormulaId(formulaId: string): Promise<DomainFormula> {
        const self = this;

        return co(function*() {
            const findComparisonFormulaByFormulaIdResult: any[] = yield self.query(util.format('CALL findComparisonFormulaByFormulaId(%s);', self.escapeAndFormat(formulaId)));

            return new DomainFormula(findComparisonFormulaByFormulaIdResult[0].formulaId, null);
        });
    }
}

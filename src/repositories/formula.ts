// Imports domain models
import { Formula as DomainFormula } from './../models/formula';
import { FormulaMeasurement as DomainFormulaMeasurement } from './../models/formula-measurement';

export interface IFormulaRepository {
    listFormulas(): Promise<DomainFormula[]>;
    listElementsByFormulaId(formulaId: string): Promise<DomainFormulaMeasurement[]>;

    findFormulaByFormulaId(formulaId: string): Promise<DomainFormula>;
    findComparisonFormulaByFormulaId(formulaId: string): Promise<DomainFormula>;

}

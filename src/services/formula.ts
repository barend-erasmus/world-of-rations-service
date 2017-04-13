// Imports
import { IFormulaRepository } from './../repositories/formula';

// Imports repositories
import { FormulaRepository } from './../repositories/mysql/formula';

// Imports domain models
import { Formula as DomainFormula } from './../models/formula';

export class FormulaService {

    constructor(private formulaRepository: IFormulaRepository) {
     }

    public listFormula(): Promise<DomainFormula[]> {
      return this.formulaRepository.listFormulas();
    }
}

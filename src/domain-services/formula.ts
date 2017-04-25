// Imports interfaces
import { IFormulaRepository } from './../domain-repositories/formula';

// Imports models
import { Formula } from './../domain-models/formula';

export class FormulaService {

    constructor(private formulaRepository: IFormulaRepository) {
     }

    public listFormula(): Promise<Formula[]> {
      return this.formulaRepository.list();
    }
}

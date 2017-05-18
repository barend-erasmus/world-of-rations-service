// Imports
import * as co from 'co';

// Imports services
import { CacheService } from './cache';

// Imports interfaces
import { IFormulaRepository } from './../domain-repositories/formula';

// Imports models
import { Formula } from './../domain-models/formula';

export class FormulaService {

    constructor(private formulaRepository: IFormulaRepository) {
     }

    public listFormula(): Promise<Formula[]> {

      const self = this;

      return co(function*() {
            const cacheService = CacheService.getInstance();

            const cachedResult: Formula[] = yield cacheService.find({
                key: "FormulaService.listFormula"
,            });

            if (cachedResult !== null) {
                return cachedResult.map((x) => Formula.mapFormula(x));
            }

            const result: Formula[] = yield self.formulaRepository.list();

            yield cacheService.add({
                key: "FormulaService.listFormula"
,            }, result, 24 * 60 * 60);

            return result;
        });
    }
}

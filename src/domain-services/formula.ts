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


    public convertFormulasToTree(formulas: Formula[]): any[] {
        const nodes: any[] = [];

        for (const formula of formulas) {
            let ns = nodes;
            for (let i = 0; i < formula.getNumberOfGroupLevels() - 1; i++) {
                let formulaGroup = formula.getGroupByLevel(i);
                let n = ns.find((x) => x.id === formulaGroup.id);

                if (!n) {
                    ns.push({
                        id: formulaGroup.id,
                        name: formulaGroup.name,
                        children: []
                    });
                    n = ns.find((x) => x.id === formulaGroup.id);
                }

                ns = n.children;
            }

            ns.push({
                id: formula.id,
                name: formula.name
            });
        }

        return nodes;
    }

    public listFormula(): Promise<Formula[]> {

        const self = this;

        return co(function* () {
            const cacheService = CacheService.getInstance();

            const cachedResult: Formula[] = yield cacheService.find({
                key: "FormulaService.listFormula"
                ,
            });

            if (cachedResult !== null) {
                return cachedResult.map((x) => Formula.mapFormula(x));
            }

            const result: Formula[] = yield self.formulaRepository.list();

            yield cacheService.add({
                key: "FormulaService.listFormula"
                ,
            }, result, 24 * 60 * 60);

            return result;
        });
    }
}

// Imports models
import { Formula } from './../../domain-models/formula';

export class FormulaRepository {

    list(): Promise<Formula[]> {
        return Promise.resolve([]);
    }

    create(formula: Formula): Promise<boolean> {
        return Promise.resolve(true);
    }

    update(formula: Formula): Promise<boolean> {
        return Promise.resolve(true);
    }

    findById(id: string): Promise<Formula> {
        return Promise.resolve(null);
    }

}

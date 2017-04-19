// Imports models
import { Formula } from './../domain-models/formula';

export interface IFormulaRepository {

    list(): Promise<Formula[]>;

    create(formula: Formula): Promise<boolean>;

    update(formula: Formula): Promise<boolean>;

    findById(id: string): Promise<Formula>;

}

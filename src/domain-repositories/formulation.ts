// Imports models
import { Formulation } from './../domain-models/formulation';

export interface IFormulationRepository {

    create(formulation: Formulation): Promise<boolean>;

    findById(id: string): Promise<Formulation>;

    list(): Promise<Formulation[]>;
}
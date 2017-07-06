// Imports models
import { Formulation } from './../../domain-models/formulation';

export class FormulationRepository {

    create(formulation: Formulation): Promise<boolean> {
        return Promise.resolve(true);
    }

    findById(id: string): Promise<Formulation> {
        return Promise.resolve(null);
    }

    list(): Promise<Formulation[]> {
        return Promise.resolve([]);
    }
}

// Imports
import * as util from 'util';
import { IFormulationRepository } from './../formulation';

// Imports domain models
import { Feedstuff as DomainFeedstuff } from './../../models/feedstuff';
import { Formula as DomainFormula } from './../../models/formula';
import { Formulation as DomainFormulation } from './../../models/formulation';

// Imports data models
import { Formulation as DataFormulation } from './../../data-models/formulation';
import { FormulationFeedstuff as DataFormulationFeedstuff } from './../../data-models/formulation-feedstuff';

export class MockFormulationRepository implements IFormulationRepository {

    constructor(private config: any) {

    }

    public insertFormulation(formulation: DomainFormulation, username: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public findFormulationById(formulationId: string, username: string): Promise<DomainFormulation> {
        return Promise.resolve(null);
    }

    public listFormulationFeedstuffByFormulationId(formulationId: string, username: string): Promise<DomainFeedstuff[]> {
        return Promise.resolve([]);
    }

    public listFormulations(username: string): Promise<DomainFormulation[]> {
        return Promise.resolve([]);
    }
}

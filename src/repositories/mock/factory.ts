// Imports repositories
import { MockElementRepository } from './element';
import { MockFeedstuffRepository } from './feedstuff';
import { MockFormulaRepository } from './formula';
import { MockFormulationRepository } from './formulation';
import { MockUserRepository } from './user';

// Imports interfaces
import { IRepositoryFactory } from './../factory';

export class RepositoryFactory implements IRepositoryFactory {

    public getInstanceOfElementRepository(config: any): MockElementRepository {
        return new MockElementRepository(config);
    }

    public getInstanceOfFeedstuffRepository(config: any): MockFeedstuffRepository {
        return new MockFeedstuffRepository(config);
    }

    public getInstanceOfFormulaRepository(config: any): MockFormulaRepository {
        return new MockFormulaRepository(config);
    }

    public getInstanceOfFormulationRepository(config: any): MockFormulationRepository {
        return new MockFormulationRepository(config);
    }

    public getInstanceOfUserRepository(config: any): MockUserRepository {
        return new MockUserRepository(config);
    }

}

// Imports repositories
import { ElementRepository } from './element';
import { FeedstuffRepository } from './feedstuff';
import { FormulaRepository } from './formula';
import { FormulationRepository } from './formulation';
import { UserRepository } from './user';

// Imports interfaces
import { IRepositoryFactory } from './../factory';

export class RepositoryFactory implements IRepositoryFactory {

    public getInstanceOfElementRepository(config: any): ElementRepository {
        return new ElementRepository(config);
    }

    public getInstanceOfFeedstuffRepository(config: any): FeedstuffRepository {
        return new FeedstuffRepository(config);
    }

    public getInstanceOfFormulaRepository(config: any): FormulaRepository {
        return new FormulaRepository(config);
    }

    public getInstanceOfFormulationRepository(config: any): FormulationRepository {
        return new FormulationRepository(config);
    }

    public getInstanceOfUserRepository(config: any): UserRepository {
        return new UserRepository(config);
    }

}

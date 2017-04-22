// Imports interfaces
import { IElementRepository } from './../element';
import { IFeedstuffRepository } from './../feedstuff';
import { IFormulaRepository } from './../formula';
import { IFormulationRepository } from './../formulation';
import { IRepositoryFactory } from './../repository-factory';
import { IUserRepository } from './../user';

// Imports repositories
import { ElementRepository } from './element';
import { FeedstuffRepository } from './feedstuff';
import { FormulaRepository } from './formula';
import { FormulationRepository } from './formulation';
import { UserRepository } from './user';

export class RepositoryFactory implements IRepositoryFactory {

    public getInstanceOfUserRepository(config: any): IUserRepository {
        return new UserRepository(config);
    }

    public getInstanceOfFeedstuffRepository(config: any): IFeedstuffRepository {
        return new FeedstuffRepository(config);
    }

    public getInstanceOfFormulaRepository(config: any): IFormulaRepository {
        return new FormulaRepository(config);
    }

    public getInstanceOfFormulationRepository(config: any): IFormulationRepository {
        return new FormulationRepository(config, this.getInstanceOfFormulaRepository(config), this.getInstanceOfFeedstuffRepository(config));
    }

    public getInstanceOfElementRepository(config: any): IElementRepository {
        return new ElementRepository(config);
    }
}

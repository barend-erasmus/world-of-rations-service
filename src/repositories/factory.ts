import { IElementRepository } from './element';
import { IFeedstuffRepository } from './feedstuff';
import { IFormulaRepository } from './formula';
import { IFormulationRepository } from './formulation';
import { IUserRepository } from './user';

export interface IRepositoryFactory {

    getInstanceOfElementRepository(config: any): IElementRepository;

    getInstanceOfFeedstuffRepository(config: any): IFeedstuffRepository;

    getInstanceOfFormulaRepository(config: any): IFormulaRepository;

    getInstanceOfFormulationRepository(config: any): IFormulationRepository;

    getInstanceOfUserRepository(config: any): IUserRepository;

}

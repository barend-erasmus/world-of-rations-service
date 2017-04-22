// Imports interfaces
import { IFeedstuffRepository } from './feedstuff';
import { IFormulaRepository } from './formula';
import { IFormulationRepository } from './formulation';
import { IUserRepository } from './user';
import { IElementRepository } from './element';

export interface IRepositoryFactory {

    getInstanceOfUserRepository(config: any): IUserRepository;
    getInstanceOfFeedstuffRepository(config: any): IFeedstuffRepository;
    getInstanceOfFormulaRepository(config: any): IFormulaRepository;
    getInstanceOfFormulationRepository(config: any): IFormulationRepository;
    getInstanceOfElementRepository(config: any): IElementRepository;
}

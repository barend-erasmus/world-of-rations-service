// Imports interfaces
import { IUserRepository } from './user';
import { IFeedstuffRepository } from './feedstuff';
import { IFormulaRepository } from './formula';
import { IFormulationRepository } from './formulation';

export interface IRepositoryFactory {
    
    getInstanceOfUserRepository(config: any): IUserRepository;
    getInstanceOfFeedstuffRepository(config: any): IFeedstuffRepository;
    getInstanceOfFormulaRepository(config: any): IFormulaRepository;
    getInstanceOfFormulationRepository(config: any): IFormulationRepository;
}
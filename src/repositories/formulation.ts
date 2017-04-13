// Imports domain models
import { Feedstuff as DomainFeedstuff } from './../models/feedstuff';
import { Formulation as DomainFormulation } from './../models/formulation';

export interface IFormulationRepository {

   insertFormulation(formulation: DomainFormulation, username: string): Promise<boolean>;

   findFormulationById(formulationId: string, username: string): Promise<DomainFormulation>;

   listFormulationFeedstuffByFormulationId(formulationId: string, username: string): Promise<DomainFeedstuff[]>;
   listFormulations(username: string): Promise<DomainFormulation[]>;

}

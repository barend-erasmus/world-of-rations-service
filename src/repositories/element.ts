// Imports domain models
import { Element as DomainElement } from './../models/element';

export interface IElementRepository {
    listElements(): Promise<DomainElement[]>;
}

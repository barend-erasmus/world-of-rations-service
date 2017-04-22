// Imports models
import { Element } from './../domain-models/element';

export interface IElementRepository {

    list(): Promise<Element[]>;

}

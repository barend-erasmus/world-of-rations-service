// Imports models
import { Element } from './../../domain-models/element';

// Imports repositories
import { IElementRepository } from './../element';

export class ElementRepository implements IElementRepository {

    list(): Promise<Element[]> {
        return null;
    }

}

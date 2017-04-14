// Imports interfaces
import { IElementRepository } from './../element';

// Imports domain models
import { Element as DomainElement } from './../../models/element';

export class MockElementRepository implements IElementRepository {

    constructor(private config: any) {

    }

    public listElements(): Promise<DomainElement[]> {
        return Promise.resolve([]);
    }

}

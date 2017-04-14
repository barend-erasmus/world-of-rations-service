// Imports
import * as co from 'co';
import * as util from 'util';
import { Base } from './base';

// Imports interfaces
import { IElementRepository } from './../element';

// Imports data models
import { Element as DataElement } from './../../data-models/element';

// Imports domain models
import { Element as DomainElement } from './../../models/element';

export class ElementRepository extends Base implements IElementRepository {

    constructor(config: any) {
        super(config);
    }

    public listElements(): Promise<DomainElement[]> {
        const self = this;

        return co(function*() {
            const listElementsResult: DataElement[] = yield self.query('CALL listElements();');

            return listElementsResult.map((x) => new DomainElement(x.id, x.name, 0, 0, 0, x.unit, x.sortOrder));
        });
    }
}

// Imports
import * as co from 'co';
import { Base } from './base';

// Imports models
import { Element } from './../../domain-models/element';

// Imports repositories
import { IElementRepository } from './../element';

export class ElementRepository extends Base implements IElementRepository {

    constructor(config: any) {
        super(config);
    }

    public list(): Promise<Element[]> {
        const self = this;

        return co(function*(){
            const result: any[] = yield self.query(`CALL listElements();`);

            const elements: Element[] = yield result.map((x) => new Element(x.id, x.name, x.unit, x.code, x.sortOrder));
            return elements;
        });
    }
}

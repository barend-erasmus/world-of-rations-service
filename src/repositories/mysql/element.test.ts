// Imports
import { expect } from 'chai';
import * as co from 'co';
import 'mocha';

// Imports configuration
import { config } from './../../config';

// Imports repositories
import { ElementRepository } from './element';

// Imports domain models
import { Element as DomainElement } from './../../models/element';

describe('ElementRepository', () => {

    describe('listElements', () => {

        let elementRepository: ElementRepository = null;

        beforeEach(() => {
            elementRepository = new ElementRepository(config.db);
        });

        it('should return list of elements', () => {

            return co(function*() {
                const listElementsResult: DomainElement[] = yield elementRepository.listElements();

                expect(listElementsResult.length).to.be.eq(80);
            });
        });
    });
});

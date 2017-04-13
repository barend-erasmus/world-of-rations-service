import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports services
import { FormulaService } from './formula';

// Imports repositories
import { MockFormulaRepository } from './../repositories/mock/formula';

// Imports domain models
import { Formula as DomainFormula } from './../models/formula';

describe('FormulaService', () => {

    describe('listFormula', () => {

        let formulaService: FormulaService = null;

        beforeEach(() => {

            const formulaRepository = new MockFormulaRepository(null);

            sinon.stub(formulaRepository, 'listFormulas').callsFake(() => {
                return Promise.resolve([
                    new DomainFormula('1', 'Formula1'),
                ]);
            });

            formulaService = new FormulaService(formulaRepository);
        });

        it('should return list of formulas', () => {

            return co(function*() {
                const listFormulaResult: DomainFormula[] = yield formulaService.listFormula();

                expect(listFormulaResult.length).to.be.eq(1);
            });
        });
    });
});

// Imports
import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports repositories
import { FormulaRepository } from './../domain-repositories/mock/formula';

// Imports services
import { FormulaService } from './formula';
import { CacheService } from './null-cache';

// Imports models
import { Formula } from './../domain-models/formula';

describe('FormulaService', function () {

    describe('listFormulas', () => {
        it('should call formulaRepository.list', () => {
            return co(function* () {

                const formulaRepository = new FormulaRepository();
                const formulaRepositoryListSpy = sinon.spy(formulaRepository, 'list');
                const formulaService = new FormulaService(CacheService.getInstance(), formulaRepository);

                yield formulaService.listFormulas();

                expect(formulaRepositoryListSpy.calledOnce).to.be.true;
            });
        });

        it('should throw exception when repository returns invalid formulas', () => {
            return co(function* () {

                const formulaRepository = new FormulaRepository();
                sinon.stub(formulaRepository, 'list').callsFake(() => {
                    return Promise.resolve([
                        new Formula(null, null, null, null, null)
                    ]);
                });
                
                const formulaService = new FormulaService(CacheService.getInstance(), formulaRepository);

                try {
                    yield formulaService.listFormulas();
                    throw new Error('Expected Error');
                } catch (err) {
                    expect(err).to.be.not.null;
                    expect(err.message).to.be.eq('Validation Failed');
                }
            });
        });
    });
});
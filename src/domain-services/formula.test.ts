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
import { FormulaGroup } from './../domain-models/formula-group';
import { TreeNode } from './../domain-models/tree-node';

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

    describe('convertFormulasToTree', () => {
        it('returns tree in correct structure', () => {
            const formulaService = new FormulaService(null, null);

            const groups: FormulaGroup[] = [
                new FormulaGroup('1', 'FormulaGroup1', new FormulaGroup('2', 'FormulaGroup2', null)),
                new FormulaGroup('3', 'FormulaGroup3', null)
            ];

            const formulas: Formula[] = [
                new Formula('1', 'Formula1', groups[0], null, null),
                new Formula('1', 'Formula1', groups[1], null, null)
            ];

            const result: TreeNode[] = formulaService.convertFormulasToTree(formulas);

            expect(result.length).to.be.eq(2);
        });
    });
});
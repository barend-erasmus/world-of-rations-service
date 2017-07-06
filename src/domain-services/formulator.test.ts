// Imports
import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports repositories
import { FormulaRepository } from './../domain-repositories/mock/formula';
import { FeedstuffRepository } from './../domain-repositories/mock/feedstuff';
import { FormulationRepository } from './../domain-repositories/mock/formulation';

// Imports services
import { FormulatorService } from './formulator';

// Imports models
import { Formula } from './../domain-models/formula';
import { Feedstuff } from './../domain-models/feedstuff';
import { FormulaElement } from './../domain-models/formula-element';
import { FormulationFeedstuff } from './../domain-models/formulation-feedstuff';
import { FeedstuffElement } from './../domain-models/feedstuff-element';

describe('FormulatorService', function () {

    describe('createFormulation', () => {
        it('returns formulation', () => {
            return co(function* () {

                const formulaRepository = new FormulaRepository();
                const feedstuffRepository = new FeedstuffRepository();

                sinon.stub(formulaRepository, 'findById').callsFake((id: string) => {
                    if (id === 'Formula1') {
                        return Promise.resolve(new Formula('Formula1', 'Formula1', null, [
                            new FormulaElement('Element1', 'Element1', '%', 0, 0, 100),
                            new FormulaElement('Element2', 'Element2', '%', 0, 0, 100)
                        ], 'Formula2'));
                    } else if (id === 'Formula2') {
                        return Promise.resolve(new Formula('F2', 'Formula2', null, [
                            new FormulaElement('Element1', 'Element1', '%', 0, 0, 100),
                            new FormulaElement('Element1', 'Element2', '%', 0, 0, 100)
                        ], null));
                    }
                });

                sinon.stub(feedstuffRepository, 'findById').callsFake((id: string) => {
                    if (id === 'Feedstuff1') {
                        return Promise.resolve(new Feedstuff('Feedstuff1', 'Feedstuff1', null, [
                            new FeedstuffElement('Element1', 'Element1', '%', null, 0, 50),
                            new FeedstuffElement('Element2', 'Element2', '%', null, 0, 50)
                        ], null));
                    } else if (id === 'Feedstuff2') {
                        return Promise.resolve(new Feedstuff('Feedstuff2', 'Feedstuff2', null, [
                            new FeedstuffElement('Element1', 'Element1', '%', null, 0, 50),
                            new FeedstuffElement('Element2', 'Element2', '%', null, 0, 50)
                        ], null));
                    }
                });

                const formulator = new FormulatorService(formulaRepository, feedstuffRepository, null);

                const result = yield formulator.createFormulation([
                    new FormulationFeedstuff('Feedstuff1', null, null, null, null, 10, 0, 1000, null),
                    new FormulationFeedstuff('Feedstuff2', null, null, null, null, 20, 0, 1000, null)
                ], 'Formula1', 'USD', 'username1');

                expect(result).is.not.null;
            });
        });
    });

    describe('formulate', () => {
        it('returns formulation result', () => {
            return co(function* () {

                const formulaRepository = new FormulaRepository();
                const feedstuffRepository = new FeedstuffRepository();
                const formulationRepository = new FormulationRepository();

                sinon.stub(formulaRepository, 'findById').callsFake((id: string) => {
                    if (id === 'Formula1') {
                        return Promise.resolve(new Formula('Formula1', 'Formula1', null, [
                            new FormulaElement('Element1', 'Element1', '%', 0, 0, 100),
                            new FormulaElement('Element2', 'Element2', '%', 0, 0, 100)
                        ], 'Formula2'));
                    } else if (id === 'Formula2') {
                        return Promise.resolve(new Formula('F2', 'Formula2', null, [
                            new FormulaElement('Element1', 'Element1', '%', 0, 0, 100),
                            new FormulaElement('Element1', 'Element2', '%', 0, 0, 100)
                        ], null));
                    }
                });

                sinon.stub(feedstuffRepository, 'findById').callsFake((id: string) => {
                    if (id === 'Feedstuff1') {
                        return Promise.resolve(new Feedstuff('Feedstuff1', 'Feedstuff1', null, [
                            new FeedstuffElement('Element1', 'Element1', '%', null, 0, 50),
                            new FeedstuffElement('Element2', 'Element2', '%', null, 0, 50)
                        ], null));
                    } else if (id === 'Feedstuff2') {
                        return Promise.resolve(new Feedstuff('Feedstuff2', 'Feedstuff2', null, [
                            new FeedstuffElement('Element1', 'Element1', '%', null, 0, 50),
                            new FeedstuffElement('Element2', 'Element2', '%', null, 0, 50)
                        ], null));
                    }
                });

                const formulatorService = new FormulatorService(formulaRepository, feedstuffRepository, formulationRepository);

                const formulation = yield formulatorService.createFormulation([
                    new FormulationFeedstuff('Feedstuff1', null, null, null, null, 10, 10, 500, null),
                    new FormulationFeedstuff('Feedstuff2', null, null, null, null, 20, 10, 500, null)
                ], 'Formula1', 'USD', 'username1');

                const result = yield formulatorService.formulate(formulation, 'username1');
                
                expect(result).is.not.null;
            });
        });
    });
});
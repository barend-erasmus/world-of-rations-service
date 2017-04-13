// Imports
import * as co from 'co';
import * as solver from 'javascript-lp-solver';
import * as uuid from 'uuid';
import { IFeedstuffRepository } from './../repositories/feedstuff';
import { IFormulaRepository } from './../repositories/formula';
import { IFormulationRepository } from './../repositories/formulation';

// Imports domain models
import { CompositionElement as DomainCompositionElement } from './../models/composition-element';
import { Feedstuff as DomainFeedstuff } from './../models/feedstuff';
import { Formula as DomainFormula } from './../models/formula';
import { FormulaMeasurement as DomainFormulaMeasurement } from './../models/formula-measurement';
import { Formulation as DomainFormulation } from './../models/formulation';
import { SupplementElement as DomainSupplementElement } from './../models/supplement-element';

// Imports repositories
import { FeedstuffRepository } from './../repositories/mysql/feedstuff';
import { FormulaRepository } from './../repositories/mysql/formula';
import { FormulationRepository } from './../repositories/mysql/formulation';

// Imports services
import { FeedstuffService } from './../services/feedstuff';

export class FormulatorService {

    private feedstuffService: FeedstuffService;

    constructor(private formulaRepository: IFormulaRepository, private feedstuffRepository: IFeedstuffRepository, private formulationRepository: IFormulationRepository) {
        this.feedstuffService = new FeedstuffService(feedstuffRepository, null);
    }

    public createFormulation(feedstuffs: DomainFeedstuff[], formulaId: string, currencyCode: string, username: string): Promise<DomainFormulation> {
        const formula = new DomainFormula(formulaId, null);
        const formulation = new DomainFormulation(uuid.v4());
        formulation.currencyCode = currencyCode;

        const self = this;

        return co(function*() {

            const populateElementsOfFeedstuffsResult: DomainFeedstuff[] = yield self.feedstuffService.populateElementsOfFeedstuffs(feedstuffs, username);
            const findFormulaByFormulaIdResult: DomainFormula = yield self.formulaRepository.findFormulaByFormulaId(formula.id);
            const listElementsByFormulaIdResult: DomainFormulaMeasurement[] = yield self.formulaRepository.listElementsByFormulaId(formula.id);

            formulation.feedstuffs = populateElementsOfFeedstuffsResult;

            formulation.formula = findFormulaByFormulaIdResult;
            formulation.formula.elements = listElementsByFormulaIdResult;

            return formulation;

        });
    }

    public formulate(formulation: DomainFormulation, username: string): Promise<any> {

        let results: any;
        const model = {
            constraints: this.buildConstraintsForSolver(formulation.feedstuffs, formulation.formula),
            opType: "min",
            optimize: "cost",
            variables: this.buildVariablesForSolver(formulation.feedstuffs),
        };

        results = solver.Solve(model);

        for (const feedstuff of formulation.feedstuffs) {
            feedstuff.weight = results[feedstuff.id] === undefined ? 0 : results[feedstuff.id];
        }

        formulation.cost = results.result / 1000;
        formulation.feasible = results.feasible;

        const self = this;

        return co(function*() {

            const insertFormulationResult: any = yield self.formulationRepository.insertFormulation(formulation, username);

            return {
                cost: formulation.cost,
                currencyCode: formulation.currencyCode,
                feasible: formulation.feasible,
                id: formulation.id,
            };

        });
    }

    public findFormulation(formulationId: string, username: string): Promise<DomainFormulation> {

        const self = this;

        return co(function*() {
            const findFormulationByIdResult: DomainFormulation = yield self.formulationRepository.findFormulationById(formulationId, username);

            let formulation: DomainFormulation = findFormulationByIdResult;

            const findFormulaByFormulaIdResult: DomainFormula = yield self.formulaRepository.findFormulaByFormulaId(formulation.formula.id);
            formulation.formula.name = findFormulaByFormulaIdResult.name;

            const populateFormulationFeedstuffOfFormulationResult: DomainFormulation = yield self.populateFormulationFeedstuffOfFormulation(findFormulationByIdResult, username);
            formulation = populateFormulationFeedstuffOfFormulationResult;

            const populateElementsOfFeedstuffsResult: DomainFeedstuff[] = yield self.feedstuffService.populateElementsOfFeedstuffs(populateFormulationFeedstuffOfFormulationResult.feedstuffs, username);
            formulation.feedstuffs = populateElementsOfFeedstuffsResult;

            const populateCompositionOfFormulationResult: DomainFormulation = yield self.populateCompositionOfFormulation(formulation);
            formulation = populateCompositionOfFormulationResult;

            const populateSupplementFeedstuffsOfFormulationResult: DomainFormulation = yield self.populateSupplementFeedstuffsOfFormulation(populateCompositionOfFormulationResult);
            formulation = populateSupplementFeedstuffsOfFormulationResult;

            return formulation;
        });
    }

    public listFormulations(): Promise<DomainFormulation[]> {
        return this.formulationRepository.listFormulations(null);
    }

    private populateSupplementFeedstuffsOfFormulation(formulation: DomainFormulation): Promise<DomainFormulation> {

        const supplementElements: DomainCompositionElement[] = formulation.composition.filter((x) => x.value < x.minimum);
        formulation.supplementComposition = [];

        const listOfPromise = [];

        for (const supplementElement of supplementElements) {
            listOfPromise.push(this.feedstuffRepository.listSupplementFeedstuffByElementId(supplementElement));
        }

        const self = this;

        return co(function*() {
            const elementsResult: DomainSupplementElement[] = yield listOfPromise;

            formulation.supplementComposition = elementsResult;
            return formulation;
        });
    }

    private populateCompositionOfFormulation(formulation: DomainFormulation): Promise<DomainFormulation> {

        const self = this;

        return co(function*() {
            const findComparisonFormulaByFormulaIdResult: DomainFormula = yield self.formulaRepository.findComparisonFormulaByFormulaId(formulation.formula.id);
            const listElementsForFormulaResult: DomainFormulaMeasurement[] = yield self.formulaRepository.listElementsByFormulaId(findComparisonFormulaByFormulaIdResult.id);

            formulation.composition = [];

            for (const element of listElementsForFormulaResult) {
                const elementId = element.id;
                const elementName = element.name;
                let elementMinimum = element.minimum == null ? 0 : element.minimum;
                let elementMaximum = element.maximum == null ? 1000000 : element.maximum;
                const elementUnit = element.unit;
                const elementSortOrder = element.sortOrder;
                let sum = 0;
                for (const feedstuff of formulation.feedstuffs) {
                    const feedstuffElements = feedstuff.elements.filter((x) => x.id === elementId);
                    if (feedstuffElements.length > 0 && feedstuff.weight !== undefined) {
                        sum += feedstuffElements[0].value * feedstuff.weight;
                    }
                }

                elementMinimum = element.minimum === null ? 0 : element.minimum;
                elementMaximum = element.maximum === null ? 1000000 : element.maximum;

                formulation.composition.push(new DomainCompositionElement(elementId, elementName, self.roundToTwoDecimal(elementMinimum), self.roundToTwoDecimal(elementMaximum), self.roundToTwoDecimal(sum / 1000), elementUnit, elementSortOrder));
            }
            return formulation;

        });
    }

    private populateFormulationFeedstuffOfFormulation(formulation: DomainFormulation, username: string): Promise<DomainFormulation> {

        const self = this;

        return co(function*() {
            const listFormulationFeedstuffByFormulationIdResult: DomainFeedstuff[] = yield self.formulationRepository.listFormulationFeedstuffByFormulationId(formulation.id, username);

            formulation.feedstuffs = listFormulationFeedstuffByFormulationIdResult;
            return formulation;
        });
    }

    private buildConstraintsForSolver(feedstuffs: DomainFeedstuff[], formula: DomainFormula) {
        const constraints = {
            weight: null,
        };

        for (const element of formula.elements) {
            constraints[element.id] = {
                max: element.maximum == null ? 100000000 : element.maximum * 1000,
                min: element.minimum * 1000,
            };
        }

        for (const feedstuff of feedstuffs) {
            constraints[feedstuff.id] = {
                max: feedstuff.maximum,
                min: feedstuff.minimum,
            };
        }

        constraints.weight = {
            max: 1000,
            min: 1000,
        };

        return constraints;
    }

    private buildVariablesForSolver(feedstuffs: DomainFeedstuff[]) {
        const variables = {};

        for (const feedstuff of feedstuffs) {
            const t = {
                cost: feedstuff.cost,
                weight: 1,
            };

            for (const element of feedstuff.elements) {
                t[element.id] = element.value;
            }

            t[feedstuff.id] = 1;

            variables[feedstuff.id] = t;
        }

        return variables;
    }

    private roundToTwoDecimal(value: number) {
        return Math.round(value * 100) / 100;
    }
}

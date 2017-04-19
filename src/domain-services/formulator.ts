// Imports
import * as co from 'co';
import * as solver from 'javascript-lp-solver';
import * as uuid from 'uuid';

// Imports interfaces
import { IFeedstuffRepository } from './../domain-repositories/feedstuff';
import { IFormulaRepository } from './../domain-repositories/formula';
import { IFormulationRepository } from './../domain-repositories/formulation';

// Imports domain models
import { CompositionElement } from './../domain-models/composition-element';
import { Formula } from './../domain-models/formula';
import { FormulaElement } from './../domain-models/formula-element';
import { Formulation } from './../domain-models/formulation';
import { FormulationFeedstuff } from './../domain-models/formulation-feedstuff';

// Imports services
import { FeedstuffService } from './../services/feedstuff';

export class FormulatorService {

    private feedstuffService: FeedstuffService;

    constructor(private formulaRepository: IFormulaRepository, private feedstuffRepository: IFeedstuffRepository, private formulationRepository: IFormulationRepository) {

    }

    public createFormulation(feedstuffs: FormulationFeedstuff[], formulaId: string, currencyCode: string, username: string): Promise<Formulation> {

        const self = this;

        return co(function*() {

            const formula: Formula = yield self.formulaRepository.findById(formulaId);
            const feedstuffsResult = yield feedstuffs.map((x) => self.feedstuffRepository.findById(x.id));

            const formulation = new Formulation(uuid.v4(), false, 0, currencyCode, formula, feedstuffsResult, username);

            return formulation;
        });
    }

    public formulate(formulation: Formulation, username: string): Promise<any> {

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

            const success: boolean = yield self.formulationRepository.create(formulation);

            return {
                cost: formulation.cost,
                currencyCode: formulation.currencyCode,
                feasible: formulation.feasible,
                id: formulation.id,
            };
        });
    }

    public findFormulation(formulationId: string, username: string): Promise<Formulation> {

        const self = this;

        return co(function*() {
            const formulation: Formulation = yield self.formulationRepository.findById(formulationId);

            if (formulation.username !== username) {
                return null;
            }

            return formulation;
        });
    }

    public listFormulations(): Promise<Formulation[]> {
        return this.formulationRepository.list();
    }

    private buildConstraintsForSolver(feedstuffs: FormulationFeedstuff[], formula: Formula) {
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

    private buildVariablesForSolver(feedstuffs: FormulationFeedstuff[]) {
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

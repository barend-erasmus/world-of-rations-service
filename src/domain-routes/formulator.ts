// Imports
import * as co from 'co';
import { Express, Request, Response } from "express";
import * as express from 'express';

// Imports app
import { WorldOfRationsApi } from './../app';

// Imports configuration
import { config } from './../config';

import { IRepositoryFactory } from './../domain-repositories/repository-factory';

// Imports models
import { Formulation } from './../domain-models/formulation';
import { FormulationResult } from './../domain-models/formulation-result';

// Imports services
import { FormulatorService } from './../domain-services/formulator';

// Imports view models
import { CompositionElement as ViewModelCompositionElement } from './../view-models/composition-element';
import { Formula as ViewModelFormula } from './../view-models/formula';
import { Formulation as ViewModelFormulation } from './../view-models/formulation';
import { FormulationFeedstuff as ViewModelFormulationFeedstuff } from './../view-models/formulation-feedstuff';
import { FormulationResult as ViewModelFormulationResult } from './../view-models/formulation-result';
import { SupplementElement as ViewModelSupplementElement } from './../view-models/supplement-element';
import { SupplementFeedstuff as ViewModelSupplementFeedstuff } from './../view-models/supplement-feedstuff';

export class FormulatorRouter {

    private router = express.Router();

    constructor() {
        this.router.post('/formulate', this.formulate);
        this.router.get('/findFormulation', this.findFormulation);
        this.router.get('/listFormulations', this.listFormulations);
    }

    public GetRouter() {
        return this.router;
    }

    private formulate(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulationRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulationRepository(config.db);
        const formulatorService = new FormulatorService(formulaRepository, feedstuffRepository, formulationRepository);

        co(function*() {
            const formulation: Formulation = yield formulatorService.createFormulation(req.body.feedstuffs, req.body.formulaId, req.body.currencyCode, req.user == null ? null : req.user.username);

            const formulationResult: FormulationResult = yield formulatorService.formulate(formulation, req.user == null ? null : req.user.username);

            res.json(new ViewModelFormulationResult(formulationResult.id, formulationResult.feasible, formulationResult.currencyCode, formulationResult.cost));

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private findFormulation(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulationRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulationRepository(config.db);
        const formulatorService = new FormulatorService(formulaRepository, feedstuffRepository, formulationRepository);

        co(function*() {
            const formulation: Formulation = yield formulatorService.findFormulation(req.query.formulationId, req.user == null ? null : req.user.username);

            res.json(new ViewModelFormulation(
                formulation.id, formulation.feasible, formulation.currencyCode, formulation.cost,
                formulation.feedstuffs.map((x) => new ViewModelFormulationFeedstuff(x.id, x.name, x.cost, x.weight, x.minimum, x.maximum)),
                new ViewModelFormula(formulation.formula.id, formulation.formula.fullname()),
                formulation.GetComposition().map((x) => new ViewModelCompositionElement(x.id, x.name, x.unit, x.status, x.value, x.sortOrder)),
                formulation.supplementElements.map((x) => new ViewModelSupplementElement(x.id, x.name, x.unit, x.sortOrder,
                    x.selectedSupplementFeedstuff === null ? [] : [new ViewModelSupplementFeedstuff(x.selectedSupplementFeedstuff.id, x.selectedSupplementFeedstuff.text, x.selectedSupplementFeedstuff.weight)],
                    x.supplementFeedstuffs.map((y) => new ViewModelSupplementFeedstuff(y.id, y.text, y.weight)))),
                    ));

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private listFormulations(req: Request, res: Response, next: () => void) {
        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulationRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulationRepository(config.db);
        const formulatorService = new FormulatorService(formulaRepository, feedstuffRepository, formulationRepository);

        co(function*() {
            const formulations: Formulation[] = yield formulatorService.listFormulations();

            res.json(formulations.map((x) => new ViewModelFormulation(x.id, x.feasible, x.currencyCode, x.cost, null, new ViewModelFormula(x.id, x.formula.fullname()), null, null)));

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }
}

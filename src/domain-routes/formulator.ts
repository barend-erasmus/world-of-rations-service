// Imports
import * as co from 'co';
import { Express, Request, Response } from "express";
import * as express from 'express';

// Imports app
import { WorldOfRationsApi } from './../app';

// Imports configuration
import { config } from './../config';

import { IRepositoryFactory } from './../domain-repositories/repository-factory';

// Imports domain models
import { Formulation } from './../domain-models/formulation';

// Imports services
import { FormulatorService } from './../domain-services/formulator';

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

            const formulationResult = yield formulatorService.formulate(formulation, req.user == null ? null : req.user.username);

            res.json(formulationResult);

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

            res.json({
                composition: formulation.GetComposition().map((x) => {
                    return {
                        id: x.id,
                        name: x.name,
                        sortOrder: x.sortOrder,
                        status: x.status,
                        unit: x.unit,
                        value: x.value,
                    };
                }),
                cost: formulation.cost,
                currencyCode: formulation.currencyCode,
                feasible: formulation.feasible,
                feedstuffs: formulation.feedstuffs.map((x) => {
                    return {
                        cost: x.cost,
                        id: x.id,
                        name: x.name,
                        weight: x.weight,
                    };
                }),
                formula: {
                    name: formulation.formula.name,
                },
                id: formulation.id,
                // supplementComposition: findFormulationResult.supplementComposition.map((x) => {
                //     return {
                //         id: x.id,
                //         name: x.name,
                //         selectedSupplementFeedstuffs: x.selectedSupplementFeedstuffs,
                //         sortOrder: x.sortOrder,
                //         supplementFeedstuffs: x.supplementFeedstuffs,
                //         unit: x.unit,
                //     };
                // }),
            });

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

            res.json(formulations.map((x) => {
                return {
                    formula: {
                        id: x.formula.id,
                        name: x.formula.name,
                    },
                    id: x.id,
                };
            }));

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }
}

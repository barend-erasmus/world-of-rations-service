// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import { WorldOfRationsApi } from './../app';
import { config } from './../config';

import { IRepositoryFactory } from './../repositories/factory';

// Imports domain models
import { Formulation as DomainFormulation } from './../models/formulation';

// Imports services
import { FormulatorService } from './../services/formulator';

export class FormulatorRouter {

    private router = express.Router();

    constructor() {
        this.router.get('/formulate', this.formulate);
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

        formulatorService.createFormulation(req.body.feedstuffs, req.body.formulaId, req.body.currencyCode, req.user == null ? null : req.user.username).then((createFormulationResult: DomainFormulation) => {
            formulatorService.formulate(createFormulationResult, req.user == null ? null : req.user.username).then((formulateResult: any) => {
                res.json(formulateResult);
            });
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private findFormulation(req: Request, res: Response, next: () => void) {
        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulationRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulationRepository(config.db);
        const formulatorService = new FormulatorService(formulaRepository, feedstuffRepository, formulationRepository);

        formulatorService.findFormulation(req.query.formulationId, req.user == null ? null : req.user.username).then((findFormulationResult: DomainFormulation) => {
            res.json({
                composition: findFormulationResult.composition.map((x) => {
                    return {
                        id: x.id,
                        name: x.name,
                        sortOrder: x.sortOrder,
                        status: x.value < x.minimum ? 'Inadequate' : x.value > x.maximum ? 'Excessive' : 'Adequate',
                        unit: x.unit,
                        value: x.value,
                    };
                }),
                cost: findFormulationResult.cost,
                currencyCode: findFormulationResult.currencyCode,
                feasible: findFormulationResult.feasible,
                feedstuffs: findFormulationResult.feedstuffs.map((x) => {
                    return {
                        cost: x.cost,
                        id: x.id,
                        name: x.name,
                        weight: x.weight,
                    };
                }),
                formula: {
                    name: findFormulationResult.formula.name,
                },
                id: findFormulationResult.id,
                supplementComposition: findFormulationResult.supplementComposition.map((x) => {
                    return {
                        id: x.id,
                        name: x.name,
                        selectedSupplementFeedstuffs: x.selectedSupplementFeedstuffs,
                        sortOrder: x.sortOrder,
                        supplementFeedstuffs: x.supplementFeedstuffs,
                        unit: x.unit,
                    };
                }),
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

        formulatorService.listFormulations().then((listFormulationsResult: DomainFormulation[]) => {
            res.json(listFormulationsResult.map((x) => {
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

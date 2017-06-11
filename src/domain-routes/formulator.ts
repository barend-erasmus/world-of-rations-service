// Imports
import * as co from 'co';
import { Express, Request, Response } from "express";
import * as express from 'express';

// Imports app
import { WorldOfRationsApi } from './../app';

// Import configurations
let config = require('./../config').config;

const argv = require('yargs').argv;

if (argv.prod) {
  config = require('./../config.prod').config;
}

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

    public static formulate(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulationRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulationRepository(config.db);
        const formulatorService = new FormulatorService(formulaRepository, feedstuffRepository, formulationRepository);

        co(function*() {
            const formulation: Formulation = yield formulatorService.createFormulation(req.body.feedstuffs, req.body.formulaId, req.body.currencyCode, req.user == null ? null : req.user.username);

            const formulationResult: FormulationResult = yield formulatorService.formulate(formulation, req.user == null ? null : req.user.username);

            res.json(formulationResult.toViewModelFormulationResult());

        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

    public static findFormulation(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulationRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulationRepository(config.db);
        const formulatorService = new FormulatorService(formulaRepository, feedstuffRepository, formulationRepository);

        co(function*() {
            const formulation: Formulation = yield formulatorService.findFormulation(req.query.formulationId, req.user == null ? null : req.user.username);

            res.json(formulation.toViewModelFormulation());

        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

    public static listFormulations(req: Request, res: Response, next: () => void) {
        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulationRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulationRepository(config.db);
        const formulatorService = new FormulatorService(formulaRepository, feedstuffRepository, formulationRepository);

        co(function*() {
            const formulations: Formulation[] = yield formulatorService.listFormulations();

            res.json(formulations.map((x) => x.toViewModelFormulation()));

        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }
}

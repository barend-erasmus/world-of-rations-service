// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';

// Imports app
import { WorldOfRationsApi } from './../app';

// Imports configuration
import { config } from './../config';

// Imports interfaces
import { IRepositoryFactory } from './../repositories/factory';

// Imports services
import { FormulaService } from './../services/formula';

export class FormulaRouter {

    private router = express.Router();

    constructor() {
        this.router.get('/listFormula', this.listFormula);
    }

    public GetRouter() {
        return this.router;
    }

    private listFormula(req: Request, res: Response, next: () => void) {
        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulaService = new FormulaService(formulaRepository);
        formulaService.listFormula().then((listFormulaResult: any[]) => {
            res.json(listFormulaResult.map((x) => {
                return {
                    id: x.id,
                    name: x.name,
                };
            }));
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

}

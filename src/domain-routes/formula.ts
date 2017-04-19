// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import * as co from 'co';

// Imports app
import { WorldOfRationsApi } from './../domain-app';

// Imports configuration
import { config } from './../config';

// Imports interfaces
import { IRepositoryFactory } from './../domain-repositories/repository-factory';

// Imports services
import { FormulaService } from './../domain-services/formula';

// Imports models
import { Formula } from './../domain-models/formula';

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

        co(function* () {
            const formulas: Formula[] = yield formulaService.listFormula();

            res.json(formulas.map((x) => {
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

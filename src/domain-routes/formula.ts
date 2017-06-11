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

// Imports interfaces
import { IRepositoryFactory } from './../domain-repositories/repository-factory';

// Imports services
import { FormulaService } from './../domain-services/formula';

// Imports models
import { Formula } from './../domain-models/formula';
import { TreeNode } from './../domain-models/tree-node';

export class FormulaRouter {

    public static listFormulas(req: Request, res: Response, next: () => void) {

        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulaService = new FormulaService(formulaRepository);

        co(function*() {
           const formulas: Formula[] = yield formulaService.listFormula();
           
           res.json(formulas.map((x) => x.toViewModelFormula(true)));
        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

    public static listFormulaTreeNodes(req: Request, res: Response, next: () => void) {

        const formulaRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFormulaRepository(config.db);
        const formulaService = new FormulaService(formulaRepository);

        co(function*() {
           const formulas: Formula[] = yield formulaService.listFormula();
           const treeNodes: TreeNode[] = formulaService.convertFormulasToTree(formulas);

           res.json(treeNodes.map((x) => x.toViewModelTreeNode()));
        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

}

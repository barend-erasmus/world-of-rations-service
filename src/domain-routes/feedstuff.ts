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
import { FeedstuffService } from './../domain-services/feedstuff';

// Imports models
import { FormulationFeedstuff } from './../domain-models/formulation-feedstuff';
import { Feedstuff } from './../domain-models/feedstuff';
import { FeedstuffElement } from './../domain-models/feedstuff-element';
import { SuggestedValue } from './../domain-models/suggested-value';

export class FeedstuffRouter {

    private router = express.Router();

    constructor() {
        this.router.get('/listFeedstuffs', this.listFeedstuffs);
        this.router.get('/listUserFeedstuffs', this.listUserFeedstuffs);
        this.router.get('/findUserFeedstuff', this.findUserFeedstuff);
        this.router.post('/createUserFeedstuff', this.createUserFeedstuff);
        this.router.get('/findSuggestedValues', this.findSuggestedValues);
        this.router.get('/listExampleFeedstuffs', this.listExampleFeedstuffs);
        this.router.post('/saveUserFeedstuff', this.saveUserFeedstuff);
    }

    public GetRouter() {
        return this.router;
    }

    private listFeedstuffs(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository);

        co(function* () {
            const feedstuffs: Feedstuff[] = yield feedstuffService.listFeedstuffs();

            res.json(feedstuffs.map((x) => {
                return {
                    id: x.id,
                    name: x.name,
                };
            }));
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private listUserFeedstuffs(req: Request, res: Response, next: () => void) {

        if (req.user == null) {
            res.status(401).end();
            return;
        }

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository);

        co(function* () {
            const feedstuffs: Feedstuff[] = yield feedstuffService.listUserFeedstuffs(req.user == null ? null : req.user.username);

            res.json(feedstuffs.map((x) => {
                return {
                    id: x.id,
                    name: x.name,
                };
            }));
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private findUserFeedstuff(req: Request, res: Response, next: () => void) {

        if (req.user == null) {
            res.status(401).end();
            return;
        }

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository);

        co(function* () {
            const feedstuff: Feedstuff = yield feedstuffService.findUserFeedstuff(req.query.feedstuffId, req.user.username);

            res.json({
                id: feedstuff.id,
                name: feedstuff.name,
                elements: feedstuff.elements
            });
        }).catch((err: Error) => {
            res.json(err.message);
        });

    }

    private createUserFeedstuff(req: Request, res: Response, next: () => void) {

        if (req.user == null) {
            res.status(401).end();
            return;
        }

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository);

        co(function* () {
            const feedstuff: Feedstuff = yield feedstuffService.createUserFeedstuff(req.user.username, req.body.name, req.body.description);

            res.json({
                id: feedstuff.id,
                name: feedstuff.name,
            });

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private findSuggestedValues(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository);

        co(function* () {
            const suggestedValue: SuggestedValue = yield feedstuffService.findSuggestedValues(req.query.formulaId, req.query.feedstuffId);

            if (suggestedValue == null) {
                res.json({
                    maximum: 1000,
                    minimum: 0,
                });
            } else {
                res.json({
                    maximum: suggestedValue.maximum,
                    minimum: suggestedValue.minimum,
                });
            }
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private listExampleFeedstuffs(req: Request, res: Response, next: () => void) {
        
        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository);

        co(function* () {
            const feedstuffs: FormulationFeedstuff[] = yield feedstuffService.listExampleFeedstuffs();

            res.json(feedstuffs.map((x) => {
                return {
                    cost: x.cost,
                    id: x.id,
                    maximum: x.maximum,
                    minimum: x.minimum,
                    name: x.name,
                };
            }));

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private saveUserFeedstuff(req: Request, res: Response, next: () => void) {

        if (req.user == null) {
            res.status(401).end();
            return;
        }

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository);

        co(function* () {
            const feedstuff: Feedstuff = yield feedstuffService.updateUserFeedstuff(req.body.feedstuffId, req.body.name, req.body.description, req.body.elements);

            res.json(feedstuff);

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }
}

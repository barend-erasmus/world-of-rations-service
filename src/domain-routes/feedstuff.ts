// Imports
import * as co from 'co';
import { Express, Request, Response } from "express";
import * as express from 'express';

// Imports app
import { WorldOfRationsApi } from './../app';

// Imports configuration
import { config } from './../config';

// Imports interfaces
import { IRepositoryFactory } from './../domain-repositories/repository-factory';

// Imports services
import { FeedstuffService } from './../domain-services/feedstuff';

// Imports models
import { Feedstuff } from './../domain-models/feedstuff';
import { FeedstuffElement } from './../domain-models/feedstuff-element';
import { FormulationFeedstuff } from './../domain-models/formulation-feedstuff';
import { SuggestedValue } from './../domain-models/suggested-value';

// Imports view models
import { ExampleFeedstuff as ViewModelExampleFeedstuff } from './../view-models/example-feedstuff';
import { Feedstuff as ViewModelFeedstuff } from './../view-models/feedstuff';
import { FeedstuffElement as ViewModelFeedstuffElement } from './../view-models/feedstuff-element';
import { SuggestedValue as ViewModelSuggestedValue } from './../view-models/suggested-value';
import { UserFeedstuff as ViewModelUserFeedstuff } from './../view-models/user-feedstuff';

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
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        co(function*() {
            let feedstuffs: Feedstuff[] = yield feedstuffService.listFeedstuffs();

            if (req.user !== null) {

                const userFeedstuffs = yield feedstuffService.listUserFeedstuffs(req.user.username);

                feedstuffs = feedstuffs.concat(userFeedstuffs);
            }

            res.json(feedstuffs.map((x) => new ViewModelFeedstuff(x.id, x.name)));

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
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        co(function*() {
           const feedstuffs: Feedstuff[] = yield feedstuffService.listUserFeedstuffs(req.user == null ? null : req.user.username);

           res.json(feedstuffs.map((x) => new ViewModelUserFeedstuff(x.id, x.name, null)));
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
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        co(function*() {
           const feedstuff: Feedstuff = yield feedstuffService.findUserFeedstuff(req.query.feedstuffId, req.user.username);

           res.json(new ViewModelUserFeedstuff(feedstuff.id, feedstuff.name, feedstuff.elements.map((x) => new ViewModelFeedstuffElement(x.id, x.name, x.unit, x.sortOrder, x.value))));

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
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        co(function*() {
           const feedstuff: Feedstuff = yield feedstuffService.createUserFeedstuff(req.user.username, req.body.name, req.body.description);

           res.json(new ViewModelUserFeedstuff(feedstuff.id, feedstuff.name, null));

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private findSuggestedValues(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        co(function*() {
           const suggestedValue: SuggestedValue = yield feedstuffService.findSuggestedValues(req.query.formulaId, req.query.feedstuffId);

           if (suggestedValue == null) {
                res.json(new ViewModelSuggestedValue(0, 1000));
            } else {
                res.json(new ViewModelSuggestedValue(suggestedValue.minimum, suggestedValue.maximum));
            }
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private listExampleFeedstuffs(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        co(function*() {
           const feedstuffs: FormulationFeedstuff[] = yield feedstuffService.listExampleFeedstuffs();

           res.json(feedstuffs.map((x) => new ViewModelExampleFeedstuff(x.id, x.name, x.cost, x.minimum, x.maximum)));

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
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        co(function*() {
           const feedstuff: Feedstuff = yield feedstuffService.updateUserFeedstuff(req.body.feedstuffId, req.body.name, req.body.description, req.body.elements);

           res.json(new ViewModelUserFeedstuff(feedstuff.id, feedstuff.name, feedstuff.elements.map((x) => new ViewModelFeedstuffElement(x.id, x.name, x.unit, x.sortOrder, x.value))));

        }).catch((err: Error) => {
            res.json(err.message);
        });
    }
}

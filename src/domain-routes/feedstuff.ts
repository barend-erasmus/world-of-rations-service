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
import { CacheService } from './../domain-services/cache';

// Imports models
import { Feedstuff } from './../domain-models/feedstuff';
import { FeedstuffElement } from './../domain-models/feedstuff-element';
import { FormulationFeedstuff } from './../domain-models/formulation-feedstuff';
import { SuggestedValue } from './../domain-models/suggested-value';

// Imports view models
import { Feedstuff as ViewModelFeedstuff } from './../view-models/feedstuff';
import { FeedstuffElement as ViewModelFeedstuffElement } from './../view-models/feedstuff-element';
import { SuggestedValue as ViewModelSuggestedValue } from './../view-models/suggested-value';

export class FeedstuffRouter {

    public static listFeedstuffs(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, elementRepository);

        co(function* () {
            let feedstuffs: Feedstuff[] = yield feedstuffService.listFeedstuffs();

            if (req.user !== undefined) {

                const userFeedstuffs = yield feedstuffService.listUserFeedstuffs(req.user.username);

                feedstuffs = feedstuffs.concat(userFeedstuffs);
            }

            res.json(feedstuffs.map((x) => x.toViewModelFeedstuff()));

        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

    public static listUserFeedstuffs(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, elementRepository);

        co(function* () {
            const feedstuffs: Feedstuff[] = yield feedstuffService.listUserFeedstuffs(req.user == null ? null : req.user.username);

            res.json(feedstuffs.map((x) => x.toViewModelFeedstuff()));
        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

    public static findUserFeedstuff(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, elementRepository);

        co(function* () {
            const feedstuff: Feedstuff = yield feedstuffService.findUserFeedstuff(req.query.feedstuffId, req.user.username);

            res.json(feedstuff.toViewModelFeedstuff());

        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });

    }

    public static createUserFeedstuff(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, elementRepository);

        co(function* () {
            const feedstuff: Feedstuff = yield feedstuffService.createUserFeedstuff(req.user.username, req.body.name, req.body.description);
            res.json(feedstuff.toViewModelFeedstuff());

        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

    public static findSuggestedValues(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, elementRepository);

        co(function* () {
            const suggestedValue: SuggestedValue = yield feedstuffService.findSuggestedValues(req.query.formulaId, req.query.feedstuffId);

            if (suggestedValue == null) {
                res.json(new ViewModelSuggestedValue(0, 1000));
            } else {
                res.json(suggestedValue.toViewModelSuggestedValue());
            }
        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

    public static listExampleFeedstuffs(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, elementRepository);

        co(function* () {
            const feedstuffs: FormulationFeedstuff[] = yield feedstuffService.listExampleFeedstuffs();

            res.json(feedstuffs.map((x) => x.toViewModelFormulationFeedstuff()));

        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }

    public static saveUserFeedstuff(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(CacheService.getInstance(), feedstuffRepository, elementRepository);

        co(function* () {
            let feedstuff: Feedstuff = Feedstuff.mapFeedstuff(req.body);
            feedstuff = yield feedstuffService.updateUserFeedstuff(feedstuff.id, feedstuff.name, null, feedstuff.elements);

            res.json(feedstuff.toViewModelFeedstuff());

        }).catch((err: Error) => {
            res.status(400).json(err.message);
        });
    }
}

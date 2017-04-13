// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import { WorldOfRationsApi } from './../app';
import { config } from './../config';

import { IRepositoryFactory } from './../repositories/factory';

// Imports services
import { FeedstuffService } from './../services/feedstuff';

// Imports models
import { Feedstuff as DomainFeedstuff } from './../models/feedstuff';
import { FeedstuffMeasurement as DomainFeedstuffMeasurement } from './../models/feedstuff-measurement';
import { SuggestedValue as DomainSuggestedValue } from './../models/suggested-value';

export class FeedstuffRouter {

    private router = express.Router();

    constructor() {
        this.router.get('/listFeedstuffs', this.listFeedstuffs);
        this.router.get('/listUserFeedstuffs', this.listUserFeedstuffs);
        this.router.get('/findUserFeedstuff', this.findUserFeedstuff);
        this.router.post('/createUserFeedstuff', this.createUserFeedstuff);
        this.router.get('/findSuggestedValues', this.findSuggestedValues);
        this.router.get('/listExampleFeedstuffs', this.listExampleFeedstuffs);
        this.router.post('/saveUserFeedstuffMeasurements', this.saveUserFeedstuffMeasurements);
        this.router.get('/listUserFeedstuffMeasurements', this.listUserFeedstuffMeasurements);
    }

    public GetRouter() {
        return this.router;
    }

    private listFeedstuffs(req: Request, res: Response, next: () => void) {

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        feedstuffService.listFeedstuffs(req.user == null ? null : req.user.username).then((listFeedstuffsResult: DomainFeedstuff[]) => {
            res.json(listFeedstuffsResult.map((x) => {
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
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        feedstuffService.listUserFeedstuffs(req.user.username).then((listFeedstuffsForUserResult: DomainFeedstuff[]) => {
            res.json(listFeedstuffsForUserResult.map((x) => {
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
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        feedstuffService.findUserFeedstuff(req.query.feedstuffId, req.user.username).then((findUserFeedstuffResult: DomainFeedstuff) => {
            res.json({
                id: findUserFeedstuffResult.id,
                name: findUserFeedstuffResult.name,
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
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);

        feedstuffService.createUserFeedstuff(req.user.username, req.body.name, req.body.description).then((createUserFeedstuffResult: DomainFeedstuff) => {
            res.json({
                id: createUserFeedstuffResult.id,
                name: createUserFeedstuffResult.name,
            });
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private findSuggestedValues(req: Request, res: Response, next: () => void) {
        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        feedstuffService.findSuggestedValues(req.query.formulaId, req.query.feedstuffId).then((findSuggestedValuesResult: DomainSuggestedValue) => {
            if (findSuggestedValuesResult == null) {
                res.json({
                    maximum: 1000,
                    minimum: 0,
                });
            } else {
                res.json({
                    maximum: findSuggestedValuesResult.maximum,
                    minimum: findSuggestedValuesResult.minimum,
                });
            }
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private listExampleFeedstuffs(req: Request, res: Response, next: () => void) {
        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        feedstuffService.listExampleFeedstuffs().then((listExampleFeedstuffsResult: DomainFeedstuff[]) => {
            res.json(listExampleFeedstuffsResult.map((x) => {
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

    private saveUserFeedstuffMeasurements(req: Request, res: Response, next: () => void) {

        if (req.user == null) {
            res.status(401).end();
            return;
        }

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        feedstuffService.saveUserFeedstuffMeasurements(req.body.feedstuffId, req.body.measurements, req.user.username).then((saveUserFeedstuffMeasurementsResult: boolean) => {
            res.json(saveUserFeedstuffMeasurementsResult);
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

    private listUserFeedstuffMeasurements(req: Request, res: Response, next: () => void) {

        if (req.user == null) {
            res.status(401).end();
            return;
        }

        const feedstuffRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfFeedstuffRepository(config.db);
        const elementRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfElementRepository(config.db);
        const feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        feedstuffService.listUserFeedstuffMeasurements(req.query.feedstuffId, req.user.username).then((listUserFeedstuffMeasurementsResult: DomainFeedstuffMeasurement[]) => {
            res.json(listUserFeedstuffMeasurementsResult.map((x) => {
                return {
                    id: x.id,
                    name: x.name,
                    unit: x.unit,
                    value: x.value,
                };
            }));
        }).catch((err: Error) => {
            res.json(err.message);
        });
    }

}

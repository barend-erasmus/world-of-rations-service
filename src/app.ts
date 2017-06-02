// Imports
import express = require("express");

// Imports interfaces
import { IRepositoryFactory } from './domain-repositories/repository-factory';

// Imports factories
import { RepositoryFactory } from './domain-repositories/mysql/repository-factory';

// Imports services
import { CacheService } from './domain-services/cache';

// Imports middleware
import bodyParser = require('body-parser');
import * as cors from 'cors';
import jwt = require('express-jwt');
import expressWinston = require('express-winston');

// Imports routes
import { AuthRouter } from './domain-routes/auth';
import { DatabaseRouter } from './domain-routes/database';
import { FeedstuffRouter } from './domain-routes/feedstuff';
import { FormulaRouter } from './domain-routes/formula';
import { FormulatorRouter } from './domain-routes/formulator';

// Imports logger
import { logger } from './logger';

// Imports configurations
import { config } from './config';

export class WorldOfRationsApi {

    public static repositoryFactory: IRepositoryFactory;

    constructor(repositoryFactory: IRepositoryFactory, private app: express.Express, private port: number) {
        WorldOfRationsApi.repositoryFactory = repositoryFactory;

        this.configureMiddleware(app);
        this.configureRoutes(app);
        this.configureErrorHandling(app);
    }

    public getApp(): express.Application {
        return this.app;
    }

    public run() {
        this.app.listen(this.port);
    }

    private configureMiddleware(app: express.Express) {

        // Configure body-parser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        // Configure CORS
        app.use(cors());

        // Configure express-jwt
        app.use(jwt({
            audience: 'worldofrations.com',
            credentialsRequired: false,
            issuer: config.oauth.jwtIssuer,
            secret: config.oauth.jwtSecret,
        }));

        // Configure express-winston
        app.use(expressWinston.logger({
            meta: false,
            msg: 'HTTP Request: {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
            winstonInstance: logger,
        }));
    }

    private configureRoutes(app: express.Express) {

        app.get('/api/auth/verify', AuthRouter.verify);
        app.get('/api/auth/google', AuthRouter.google);
        app.get('/api/auth/google/callback', AuthRouter.googleCallback);

        app.get('/api/database/export', DatabaseRouter.export);

        app.get('/api/feedstuff"/listFeedstuffs', FeedstuffRouter.listFeedstuffs);
        app.get('/api/feedstuff"/listUserFeedstuffs', FeedstuffRouter.listUserFeedstuffs);
        app.get('/api/feedstuff"/findUserFeedstuff', FeedstuffRouter.findUserFeedstuff);
        app.post('/api/feedstuff"/createUserFeedstuff', FeedstuffRouter.createUserFeedstuff);
        app.get('/api/feedstuff"/findSuggestedValues', FeedstuffRouter.findSuggestedValues);
        app.get('/api/feedstuff"/listExampleFeedstuffs', FeedstuffRouter.listExampleFeedstuffs);
        app.post('/api/feedstuff"/saveUserFeedstuff', FeedstuffRouter.saveUserFeedstuff);

        app.get('/api/formul/listFormula', FormulaRouter.listFormula);

        app.post('/api/formulator/formulate', FormulatorRouter.formulate);
        app.get('/api/formulator/findFormulation', FormulatorRouter.findFormulation);
        app.get('/api/formulator/listFormulations', FormulatorRouter.listFormulations);
    }

    private configureErrorHandling(app: express.Express) {
        app.use((err: Error, req: express.Request, res: express.Response, next: () => void) => {
            logger.error(err.message);
            if (err.name === 'UnauthorizedError') {
                res.status(401).end();
            } else {
                res.status(500).send(err.message);
            }
        });
    }
}

const port = 3000;
const api = new WorldOfRationsApi(new RepositoryFactory(), express(), port);
api.run();
logger.info(`Listening on ${port}`);

CacheService.getInstance().flush().then(() => {
    logger.info('Cache cleared');
});

// Imports
import express = require("express");
const swaggerUi = require('swagger-ui-express');
import { swaggerDocument } from './swagger.json';


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
    }

    private configureRoutes(app: express.Express) {

        app.get('/api/auth/verify', this.logger, this.requiresAuthentication, AuthRouter.verify);
        app.get('/api/auth/google', this.logger, AuthRouter.google);
        app.get('/api/auth/google/callback', this.logger, AuthRouter.googleCallback);

        app.get('/api/database/export', this.logger, DatabaseRouter.export);
        app.get('/api/database/logs', DatabaseRouter.logs);

        app.get('/api/feedstuff/listFeedstuffs', this.logger, FeedstuffRouter.listFeedstuffs);
        app.get('/api/feedstuff/listUserFeedstuffs', this.logger, this.requiresAuthentication, FeedstuffRouter.listUserFeedstuffs);
        app.get('/api/feedstuff/findUserFeedstuff', this.logger, this.requiresAuthentication, FeedstuffRouter.findUserFeedstuff);
        app.post('/api/feedstuff/createUserFeedstuff', this.logger, this.requiresAuthentication, FeedstuffRouter.createUserFeedstuff);
        app.get('/api/feedstuff/findSuggestedValues', this.logger, FeedstuffRouter.findSuggestedValues);
        app.get('/api/feedstuff/listExampleFeedstuffs', this.logger, FeedstuffRouter.listExampleFeedstuffs);
        app.post('/api/feedstuff/saveUserFeedstuff', this.logger, this.requiresAuthentication, FeedstuffRouter.saveUserFeedstuff);

        app.get('/api/formula/listFormulas', this.logger, FormulaRouter.listFormulas);
        app.get('/api/formula/listFormulaTreeNodes', this.logger, FormulaRouter.listFormulaTreeNodes);

        app.post('/api/formulator/formulate', this.logger, FormulatorRouter.formulate);
        app.get('/api/formulator/findFormulation', this.logger, FormulatorRouter.findFormulation);
        app.get('/api/formulator/listFormulations', this.logger, FormulatorRouter.listFormulations);

        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private requiresAuthentication(req: express.Request, res: express.Response, next: () => void) {
        if (req.user == null) {
            res.status(401).end();
        } else {
            next();
        }
    }

    private logger(req: express.Request, res: express.Response, next: () => void) {
        var start = Date.now();
        res.on('finish', function () {
            const duration = Date.now() - start;

            logger.info(`${req.method} - ${req.url} - [${duration} ms]`, {
                type: 'expressjs',
                hostname: req.hostname,
                headers: req.headers,
                url: req.url,
                method: req.method,
                status: res.statusCode,
                responseTime: duration
            });
        });

        next();
    }

    private configureErrorHandling(app: express.Express) {
        app.use((err: Error, req: express.Request, res: express.Response, next: () => void) => {
            logger.error(err.message, {
                type: 'expressjs',
                hostname: req.hostname,
                headers: req.headers,
                url: req.url,
                method: req.method,
                status: res.statusCode,
            });

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
logger.debug(`listening on ${port}`, {
    type: 'app',
});

CacheService.getInstance().flush().then(() => {
    logger.debug('cache cleared', {
        type: 'app',
    });
});

// Imports
import express = require("express");
import { IRepositoryFactory } from './repositories/factory';
import { RepositoryFactory } from './repositories/mysql/factory';

// Imports middleware
import bodyParser = require('body-parser');
import * as cors from 'cors';
import jwt = require('express-jwt');
import expressWinston = require('express-winston');

// Imports routes
import { AuthRouter } from './routes/auth';
import { DatabaseRouter } from './routes/database';
import { FeedstuffRouter } from './routes/feedstuff';
import { FormulaRouter } from './routes/formula';
import { FormulatorRouter } from './routes/formulator';

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
        app.use("/api/feedstuff", new FeedstuffRouter().GetRouter());
        app.use("/api/formula", new FormulaRouter().GetRouter());
        app.use("/api/formulator", new FormulatorRouter().GetRouter());
        app.use("/api/auth", new AuthRouter().GetRouter());
        app.use("/api/database", new DatabaseRouter().GetRouter());
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

const port = 8083;
const api = new WorldOfRationsApi(new RepositoryFactory(), express(), port);
api.run();
logger.info(`Listening on ${port}`);

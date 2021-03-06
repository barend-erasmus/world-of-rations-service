// Imports
import * as co from 'co';
import { Express, Request, Response } from "express";
import * as express from 'express';
import * as request from 'request';

// Import configurations
let config = require('./../config').config;

const argv = require('yargs').argv;

if (argv.prod) {
  config = require('./../config.prod').config;
}

// Imports app
import { WorldOfRationsApi } from './../app';

// Imports interfaces
import { IRepositoryFactory } from './../domain-repositories/repository-factory';

// Imports services
import { AuthService } from './../domain-services/auth';
import { UserService } from './../domain-services/user';

// Imports logger
import { logger } from './../logger';

export class AuthRouter {

    public static verify(req: Request, res: Response, next: () => void) {
        res.json(req.user);
    }

    public static google(req: Request, res: Response, next: () => void) {

        const authService = new AuthService(config.baseUri, config.oauth.jwtSecret, config.oauth.jwtIssuer, config.oauth);

        const auth = authService.createClientAuths();
        const uri = auth.googleAuth.code.getUri();

        res.redirect(uri);
    }

    public static googleCallback(req: Request, res: Response, next: () => void) {

        const userRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfUserRepository(config.db);

        const authService = new AuthService(config.baseUri, config.oauth.jwtSecret, config.oauth.jwtIssuer, config.oauth);
        const userService = new UserService(userRepository);

        const auth = authService.createClientAuths();

        co(function*() {
           const user: any = yield auth.googleAuth.code.getToken(req.originalUrl);

           request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + user.accessToken, (error: Error, response: any, body: any) => {
                if (!error && response.statusCode === 200) {
                    userService.login(JSON.parse(body).email).then((loginResult: any) => {
                        const token = authService.encodeToken(JSON.parse(body).email);
                        res.redirect(config.web.uri + '/login?token=' + token);
                    });
                } else {
                    res.status(400).send('An error occurred while requesting user data from Google');
                }
            });

        }).catch((err: Error) => {
            return res.status(400).send(err.message);
        });
    }
}

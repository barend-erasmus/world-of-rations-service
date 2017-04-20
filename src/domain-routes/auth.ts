// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import * as request from 'request';
import { config } from './../config';
import * as co from 'co';

// Imports app
import { WorldOfRationsApi } from './../app';

// Imports interfaces
import { IRepositoryFactory } from './../domain-repositories/repository-factory';

// Imports services
import { AuthService } from './../domain-services/auth';
import { UserService } from './../domain-services/user';

export class AuthRouter {

    private router = express.Router();

    constructor() {
        this.router.get('/verify', this.verify);
        this.router.get('/google', this.google);
        this.router.get('/google/callback', this.googleCallback);
    }

    public GetRouter() {
        return this.router;
    }

    private verify(req: Request, res: Response, next: () => void) {

        if (req.user == null) {
            res.status(401).end();
            return;
        }

        res.json(req.user);
    }

    private google(req: Request, res: Response, next: () => void) {

        const authService = new AuthService(config.baseUri, config.oauth.jwtSecret, config.oauth.jwtIssuer, config.oauth);

        const auth = authService.createClientAuths();
        const uri = auth.googleAuth.code.getUri();

        res.redirect(uri);
    }

    private googleCallback(req: Request, res: Response, next: () => void) {
        
        const userRepository = WorldOfRationsApi.repositoryFactory.getInstanceOfUserRepository(config.db);

        const authService = new AuthService(config.baseUri, config.oauth.jwtSecret, config.oauth.jwtIssuer, config.oauth);
        const userService = new UserService(userRepository);

        const auth = authService.createClientAuths();

        co(function* () {
            const user: any = auth.googleAuth.code.getToken(req.originalUrl);

            request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + user.accessToken, (error: Error, response: any, body: any) => {
                if (!error && response.statusCode === 200) {
                    userService.login(JSON.parse(body).email).then((loginResult: any) => {
                        const token = authService.encodeToken(JSON.parse(body).email);
                        res.redirect(config.web.uri + '/login?token=' + token);
                    });
                } else {
                    return res.status(500).send('An Error Occurred');
                }
            });

        }).catch((err: Error) => {
            return res.status(500).send(err.message);
        });
    }
}

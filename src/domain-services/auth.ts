// Imports
import * as base64 from 'base-64';
import * as clientOAuth2 from 'client-oauth2';
import * as jwt from 'jsonwebtoken';
import * as utf8 from 'utf8';
import * as uuid from 'uuid';

// Imports logger
import { logger } from './../logger';

export class AuthService {

    constructor(private baseUri: string, private jwtSecret: string, private jwtIssuer: string, private oauthConfig: any) { }

    public verify(token: string): boolean {
        try {
            const decoded = jwt.verify(token, this.jwtSecret, {
                issuer: this.jwtIssuer,
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    public encodeToken(username: string): string {
        const token = jwt.sign({ username }, this.jwtSecret, {
            audience: 'worldofrations.com',
            expiresIn: 3600,
            issuer: this.jwtIssuer,
            jwtid: uuid.v4(),
        });

        return token;
    }

    public decodeToken(token: string): any {
        try {
            const decoded = jwt.verify(token, this.jwtSecret, {
                issuer: this.jwtIssuer,
            });
            return decoded;
        } catch (err) {
            return null;
        }
    }

    public createClientAuths(): any {

        const googleAuth = new clientOAuth2({
            accessTokenUri: 'https://www.googleapis.com/oauth2/v4/token',
            authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
            clientId: this.oauthConfig.google.clientId,
            clientSecret: this.oauthConfig.google.clientSecret,
            redirectUri: this.baseUri + '/api/auth/google/callback',
            scopes: ['https://www.googleapis.com/auth/userinfo.email'],
        }, null);

        return {
            googleAuth,
        };
    }
}

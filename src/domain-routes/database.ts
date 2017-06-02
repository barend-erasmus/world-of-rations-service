// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import mysqldump = require('mysqldump');

// Imports configuration
import { config } from './../config';

export class DatabaseRouter {

    public static export(req: Request, res: Response, next: () => void) {

        mysqldump({
            database: config.db.database,
            dest: './data.sql',
            host: config.db.server,
            password: 'password',
            user: 'root',
        }, (err: Error) => {
            res.sendfile('./data.sql', {
                headers: {
                    "content-disposition": "attachment; filename=\"data.sql\"",
                },
            });
        });
    }
}

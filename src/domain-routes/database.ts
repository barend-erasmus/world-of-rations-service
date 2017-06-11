// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import mysqldump = require('mysqldump');
import * as Handlebars from 'handlebars';

// Imports logger
import { logger } from './../logger';

// Import configurations
let config = require('./../config').config;

const argv = require('yargs').argv;

if (argv.prod) {
  config = require('./../config.prod').config;
}

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

    public static logs(req: Request, res: Response, next: () => void) {

        logger.query({
            fields: ['timestamp', 'message'],
            limit: 100,
            start: 0,
            order: 'desc',
        }, (err: Error, results: any) => {
            const html = '<style>table{font-family: arial, sans-serif; border-collapse: collapse; width: 100%;}td, th{border: 1px solid #dddddd; text-align: left; padding: 8px;}tr:nth-child(even){background-color: #dddddd;}</style><table><tr><th>Timestamp</th><th>Message</th></tr>{{#each messages as |value key|}}<tr><td>{{value.timestamp}}</td><td>{{value.message}}</td></tr>{{/each}}</table>';
            const template = Handlebars.compile(html);
            const result = template({
                messages: results.file
            });
            res.send(result);
        });
    }
}

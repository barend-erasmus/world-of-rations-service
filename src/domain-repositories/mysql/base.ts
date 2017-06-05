// Imports
import * as co from 'co';
import * as mysql from 'mysql';

// Imports services
import { CacheService } from './../../domain-services/cache';

// Imports logger
import { logger } from './../../logger';

let pool = null;

export class Base {

    constructor(private config: any) {
        if (pool == null && config != null) {
            pool = mysql.createPool({
                connectionLimit: 50,
                database: this.config.database,
                host: this.config.server,
                password: this.config.password,
                user: this.config.user,
            });
        }
    }

    protected queryDatabase(query: string): Promise<any> {

        return new Promise((resolve: (x: any) => void, reject: (err: Error) => void) => {
            pool.getConnection((err1: Error, connection: any) => {
                if (err1) {
                    logger.error(`'${query}' failed`, {
                        type: 'repository',
                        query: query
                    });
                    reject(err1);
                } else {
                    connection.query(query, (err2: Error, results: any[], fields) => {
                        connection.release();
                        if (err2) {
                            logger.error(`'${query}' failed`, {
                                type: 'repository',
                                query: query
                            });
                            reject(err2);
                        } else {
                            if (results[0] === undefined) {
                                logger.info(`${query}`, {
                                    type: 'repository',
                                    query: query,
                                    numberOfResults: 0
                                });
                            } else {
                                logger.info(`${query} => ${results[0].length}`, {
                                    type: 'repository',
                                    query: query,
                                    numberOfResults: results[0].length
                                });
                            }
                            resolve(results[0]);
                        }
                    });
                }
            });
        });
    }

    protected query(query: string, useCache: boolean): Promise<any> {

        const self = this;

        return co(function* () {

            if (useCache === false) {
                return self.queryDatabase(query);
            }

            const cacheService: CacheService = CacheService.getInstance();

            const cachedResult: any = yield cacheService.find({
                query
            });

            if (cachedResult !== null) {
                return cachedResult;
            }

            const result: any = yield self.queryDatabase(query);

            yield cacheService.add({
                query
            }, result, 24 * 60 * 60);

            return result;
        });
    }

    protected roundToTwoDecimal(value: number): number {
        return Math.round(value * 100) / 100;
    }

    protected escapeAndFormat(str: string): string {

        if (str === null || str === 'null') {
            return 'null';
        }

        str = str.replace('\'', '\\\'');

        return '\'' + str + '\'';
    }
}

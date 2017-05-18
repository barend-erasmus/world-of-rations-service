// Imports
import * as mysql from 'mysql';

// Imports logger
import { getLogger } from './../../logger';

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

    protected query(query: string): Promise<any> {
           return new Promise((resolve: (x: any) => void, reject: (err: Error) => void) => {
            pool.getConnection((err1: Error, connection: any) => {
                if (err1) {
                    getLogger('mysql').debug(`${query} failed`);
                    reject(err1);
                } else {
                    connection.query(query, (err2: Error, results: any[], fields) => {
                        connection.release();
                        if (err2) {
                            getLogger('mysql').debug(`${query} failed`);
                            reject(err2);
                        } else {
                            if (results[0] === undefined) {
                                getLogger('mysql').debug(`${query}`);
                            } else {
                                getLogger('mysql').debug(`${query} => ${results[0].length}`);
                            }
                            resolve(results[0]);
                        }
                    });
                }
            });
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

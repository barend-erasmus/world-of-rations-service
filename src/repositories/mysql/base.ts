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

    public queryForTest(query: string): Promise<any> {
        getLogger('mysql').debug(query);

        return this.query(query);
    }

    protected query(query: string): Promise<any> {
        getLogger('mysql').debug(query);

        return new Promise((resolve: (x: any) => void, reject: (err: Error) => void) => {
            pool.getConnection((err1: Error, connection: any) => {
                if (err1) {
                    reject(err1);
                } else {
                    connection.query(query, (err2: Error, results: any[], fields) => {
                        connection.release();
                        if (err2) {
                            reject(err2);
                        } else {
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

// Imports
import * as hash from 'object-hash';
import * as redis from 'redis';

// Imports configuration
import { config } from './../config';

export class CacheService {

    public static getInstance(): CacheService {
        if (CacheService.instance === null) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    private static instance: CacheService = null;
    private static redisClient: any = null;

    public find(key: any): Promise<any> {
        return Promise.resolve(null);
        
        // const sha1: string = hash(key);
        // const redisClient: any = this.getRedisClient();

        // return new Promise((resolve, reject) => {
        //     redisClient.get(sha1, (err: Error, reply: any) => {
        //         if (err) {
        //             reject();
        //             return;
        //         }

        //         resolve(JSON.parse(reply));
        //     });
        // });
    }

    public add(key: any, obj: any, ex: number): Promise<boolean> {
        return Promise.resolve(true);

        // const sha1: string = hash(key);
        // const redisClient: any = this.getRedisClient();

        // return new Promise((resolve, reject) => {
        //     redisClient.setex(sha1, ex, JSON.stringify(obj));
        //     resolve(true);
        // });
    }

    public flush(): Promise<boolean> {
        return Promise.resolve(true);

        // const redisClient: any = this.getRedisClient();

        // return new Promise((resolve, reject) => {

        //     redisClient.flushdb((err: Error, succeeded: boolean) => {
        //         resolve(true);
        //     });
        // });
    }

    private getRedisClient() {

        if (CacheService.redisClient !== null) {
            return CacheService.redisClient;
        }

        CacheService.redisClient = redis.createClient({
            host: config.redis.server,
            port: config.redis.port,
            retry_strategy: (options: any) => {
                if (options.error && options.error.code === 'ECONNREFUSED') {
                    // End reconnecting on a specific error and flush all commands with a individual error
                    return new Error('The server refused the connection');
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands with a individual error
                    return new Error('Retry time exhausted');
                }
                if (options.times_connected > 10) {
                    // End reconnecting with built in error
                    return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            },
        });

        return CacheService.redisClient;
    }

}

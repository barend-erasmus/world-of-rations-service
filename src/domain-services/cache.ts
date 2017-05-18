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

    public find(key: any): Promise<any> {
        const sha1: string = hash(key);
        const redisClient: any = redis.createClient({
            host: config.redis.server,
            port: config.redis.port,
        });

        return new Promise((resolve, reject) => {
            redisClient.get(sha1, (err: Error, reply: any) => {
                if (err) {
                    reject();
                    return;
                }

                resolve(JSON.parse(reply));
            });
        });
    }

    public add(key: any, obj: any, ex: number): Promise<boolean> {
        const sha1: string = hash(key);
        const redisClient: any = redis.createClient({
            host: config.redis.server,
            port: config.redis.port,
        });

        return new Promise((resolve, reject) => {
            redisClient.set(sha1, JSON.stringify(obj), 'EX', ex);
            resolve(true);
        });
    }

    public flush(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

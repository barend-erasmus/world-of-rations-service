// Imports interfaces
import { ICacheService } from './interfaces/cache';

export class CacheService implements ICacheService {

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
    }

    public add(key: any, obj: any, ex: number): Promise<boolean> {
        return Promise.resolve(true);
    }

    public flush(): Promise<boolean> {
        return Promise.resolve(true);
    }

    private getRedisClient() {

    }
}

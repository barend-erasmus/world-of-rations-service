export interface ICacheService {
    find(key: any): Promise<any>;
    add(key: any, obj: any, ex: number): Promise<boolean>;
    flush(): Promise<boolean>;
}
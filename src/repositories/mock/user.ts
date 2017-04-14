// Imports
import * as util from 'util';

// Imports interfaces
import { IUserRepository } from './../user';

// Imports data models
import { User as DataUser } from './../../data-models/user';

// Imports domain models
import { User as DomainUser } from './../../models/user';

export class MockUserRepository implements IUserRepository {

    constructor(private config: any) {
    }

    public insertUser(username: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public findUserByUsername(username: string): Promise<DomainUser> {
        return Promise.resolve(null);
    }

    public updateLastLoginTimestamp(username: string): Promise<boolean> {
        return Promise.resolve(true);
    }
}

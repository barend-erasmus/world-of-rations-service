// Imports domain models
import { User as DomainUser } from './../models/user';

export interface IUserRepository {

    insertUser(username: string): Promise<boolean>;

    findUserByUsername(username: string): Promise<DomainUser>;

    updateLastLoginTimestamp(username: string): Promise<boolean>;

}

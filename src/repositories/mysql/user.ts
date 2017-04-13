// Imports
import * as co from 'co';
import * as util from 'util';
import { IUserRepository } from './../user';
import { Base } from './base';

// Imports data models
import { User as DataUser } from './../../data-models/user';

// Imports domain models
import { User as DomainUser } from './../../models/user';

export class UserRepository extends Base implements IUserRepository {

    constructor(config: any) {
        super(config);
    }

    public insertUser(username: string): Promise<boolean> {
        const self = this;

        return co(function*() {
            const insertUserResult = yield self.query(util.format('CALL insertUser(%s, %s)', self.escapeAndFormat(username), new Date().getTime() / 1000));

            return true;
        });
    }

    public findUserByUsername(username: string): Promise<DomainUser> {
        const self = this;

        return co(function*() {
            const findUserByUsernameResult: DataUser[] = yield self.query(util.format('CALL findUserByUsername(%s)', self.escapeAndFormat(username)));

            if (findUserByUsernameResult.length === 0) {
                return null;
            } else {
                return new DomainUser(findUserByUsernameResult[0].id, findUserByUsernameResult[0].username, findUserByUsernameResult[0].lastLoginTimestamp);
            }
        });
    }

    public updateLastLoginTimestamp(username: string): Promise<boolean> {
        const self = this;

        return co(function*() {
            const insertUserResult = yield self.query(util.format('CALL updateLastLoginTimestamp(%s, %s)', self.escapeAndFormat(username), new Date().getTime() / 1000));

            return true;
        });
    }
}

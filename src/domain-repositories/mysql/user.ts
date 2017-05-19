// Imports
import * as co from 'co';
import { Base } from './base';

// Imports repositories
import { IUserRepository } from './../user';

// Imports models
import { User } from './../../domain-models/user';

export class UserRepository extends Base implements IUserRepository {

    public findByUsername(username: string): Promise<User> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL findUserByUsername('${username}');`, false);

            if (result.length === 0) {
                return null;
            }

            const user: User = new User(result[0].username, result[0].lastLoginTimestamp);

            return user;
        });
    }

    public update(user: User): Promise<boolean> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL updateUser('${user.username}', ${user.lastLoginTimestamp})`, false);

            return true;
        });
    }

    public create(user: User): Promise<boolean> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL insertUser('${user.username}', ${user.lastLoginTimestamp})`, false);

            return true;
        });
    }
}

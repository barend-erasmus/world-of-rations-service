// Imports
import * as co from 'co';

// Imports repositories
import { IUserRepository } from './../repositories/user';

// Imports domain models
import { User as DomainUser } from './../models/user';

export class UserService {

    constructor(private userRepository: IUserRepository) {
    }

    public login(username: string): Promise<boolean> {
        const self = this;

        return co(function*() {
            const findUserByUsernameResult: DomainUser = yield self.userRepository.findUserByUsername(username);

            if (findUserByUsernameResult == null) {
                return self.userRepository.insertUser(username);
            } else {
                return self.userRepository.updateLastLoginTimestamp(username);
            }
        });
    }
}

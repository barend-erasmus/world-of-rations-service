// Imports
import * as co from 'co';

// Imports interfaces
import { IUserRepository } from './../domain-repositories/user';

// Imports models
import { User } from './../domain-models/user';

export class UserService {

    constructor(private userRepository: IUserRepository) {
    }

    public login(username: string): Promise<boolean> {
        const self = this;

        return co(function*() {
            let user: User = yield self.userRepository.findByUsername(username);

            if (user == null) {
                user = new User(username, new Date().getTime());
                return self.userRepository.create(user);
            } else {
                user.lastLoginTimestamp = new Date().getTime();
                return self.userRepository.update(user);
            }
        });
    }
}

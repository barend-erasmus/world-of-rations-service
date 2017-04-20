// Imports models
import { User } from './../../domain-models/user';

export class UserRepository {

    public findByUsername(username: string): Promise<User> {
        return null;
    }

    public update(user: User): Promise<boolean> {
        return null;
    }

    public create(create: User): Promise<boolean> {
        return null;
    }
}

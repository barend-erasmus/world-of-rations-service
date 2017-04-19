// Imports models
import { User } from './../domain-models/user';

export interface IUserRepository {
    findByUsername(username: string): Promise<User>;

    update(user: User): Promise<boolean>;

    create(create: User): Promise<boolean>;
}
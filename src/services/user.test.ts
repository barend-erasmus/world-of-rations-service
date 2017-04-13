import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports services
import { UserService } from './user';

// Imports repositories
import { MockUserRepository } from './../repositories/mock/user';

// Imports domain models
import { User as DomainUser } from './../models/user';

describe('UserService', () => {

    describe('login', () => {

        let insertUserSpy: sinon.SinonSpy = null;
        let updateLastLoginTimestampSpy: sinon.SinonSpy = null;
        let userService: UserService = null;

        beforeEach(() => {

            const userRepository = new MockUserRepository(null);

            insertUserSpy = sinon.spy(userRepository, 'insertUser');
            updateLastLoginTimestampSpy = sinon.spy(userRepository, 'updateLastLoginTimestamp');

            sinon.stub(userRepository, 'findUserByUsername').callsFake((username: string) => {
                if (username === 'User1') {
                    return Promise.resolve(new DomainUser('1', 'User1', 0));
                }else {
                    return Promise.resolve(null);
                }
            });

            userService = new UserService(userRepository);
        });

        it('should return true', () => {
            return co(function*() {
                const loginResult: boolean = yield userService.login('User1');

                expect(loginResult).to.be.true;
            });
        });

        it('should call insertUser given user does not exist', () => {
            return co(function*() {
                const loginResult: boolean = yield userService.login('User2');

                sinon.assert.calledOnce(insertUserSpy);
                sinon.assert.notCalled(updateLastLoginTimestampSpy);
            });
        });

        it('should call updateLastLoginTimestamp given user does exist', () => {
            return co(function*() {
                const loginResult: boolean = yield userService.login('User1');

                sinon.assert.calledOnce(updateLastLoginTimestampSpy);
                sinon.assert.notCalled(insertUserSpy);
            });
        });
    });
});

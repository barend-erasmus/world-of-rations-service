import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as uuid from 'uuid';
import { config } from './../../config';

// Imports repositories
import { Base } from './base';
import { FeedstuffRepository } from './feedstuff';
import { UserRepository } from './user';

// Imports domain models
import { Element as DomainElement } from './../../models/element';
import { Feedstuff as DomainFeedstuff } from './../../models/feedstuff';
import { SuggestedValue as DomainSuggestedValue } from './../../models/suggested-value';

describe('FeedstuffRepository', () => {

    describe('listFeedstuffs', () => {

        let feedstuffRepository: FeedstuffRepository = null;
        let userRepository: UserRepository = null;
        let base: Base = null;

        let feedstuffId: string = null;

        beforeEach(() => {
            base = new Base(config.db);
            feedstuffRepository = new FeedstuffRepository(config.db);
            userRepository = new UserRepository(config.db);
        });

        afterEach((done: () => void) => {
            const p1 = base.queryForTest('DELETE FROM users WHERE `username` = \'User1\'');
            const p2 = base.queryForTest('DELETE FROM userFeedstuffs WHERE `id` = \'' + feedstuffId + '\'');

            Promise.all([
                p1,
                p2,
            ]).then((result) => {
                done();
            });
        });

        it('should return list of feedstuff given null username', () => {

            return co(function*() {

                const listFeedstuffsResult: DomainFeedstuff[] = yield feedstuffRepository.listFeedstuffs(null);

                expect(listFeedstuffsResult.length).to.be.eq(264);
            });
        });

        it('should return list of feedstuff given valid username', () => {

            return co(function*() {

                const insertUserResult = yield userRepository.insertUser('User1');

                feedstuffId = uuid.v4();
                const insertUserFeedstuffResult = yield feedstuffRepository.insertUserFeedstuff('User1', feedstuffId, 'Feedstuff1', 'Feedstuff1');

                const listFeedstuffsResult: DomainFeedstuff[] = yield feedstuffRepository.listFeedstuffs('User1');

                expect(listFeedstuffsResult.length).to.be.eq(264 + 1);
            });
        });
    });

    describe('listExampleFeedstuffs', () => {

        let feedstuffRepository: FeedstuffRepository = null;
        beforeEach(() => {
            feedstuffRepository = new FeedstuffRepository(config.db);
        });

        afterEach((done: () => void) => {
            done();
        });

        it('should return list of feedstuff', () => {

            return co(function*() {

                const listExampleFeedstuffsResult: DomainFeedstuff[] = yield feedstuffRepository.listExampleFeedstuffs();

                expect(listExampleFeedstuffsResult.length).to.be.eq(13);
            });
        });
    });

    describe('findFeedstuffByFeedstuffId', () => {

        let feedstuffRepository: FeedstuffRepository = null;
        let userRepository: UserRepository = null;
        let base: Base = null;

        let feedstuffId: string = null;

        beforeEach(() => {
            base = new Base(config.db);
            feedstuffRepository = new FeedstuffRepository(config.db);
            userRepository = new UserRepository(config.db);
        });

        afterEach((done: () => void) => {
            const p1 = base.queryForTest('DELETE FROM users WHERE `username` = \'User1\'');
            const p2 = base.queryForTest('DELETE FROM userFeedstuffs WHERE `id` = \'' + feedstuffId + '\'');

            Promise.all([
                p1,
                p2,
            ]).then((result) => {
                done();
            });
        });

        it('should return feedstuff given feedstuff id', () => {

            return co(function*() {

                const findFeedstuffByFeedstuffIdResult: DomainFeedstuff[] = yield feedstuffRepository.findFeedstuffByFeedstuffId('36995DEF-9B6B-49CD-9AA6-0165478BA4CD');

                expect(findFeedstuffByFeedstuffIdResult).to.be.not.null;
            });
        });

        it('should return null given user feedstuff id', () => {

            return co(function*() {

                const insertUserResult = yield userRepository.insertUser('User1');

                feedstuffId = uuid.v4();
                const insertUserFeedstuffResult = yield feedstuffRepository.insertUserFeedstuff('User1', feedstuffId, 'Feedstuff1', 'Feedstuff1');

                const findFeedstuffByFeedstuffIdResult: DomainFeedstuff[] = yield feedstuffRepository.findFeedstuffByFeedstuffId(feedstuffId);

                expect(findFeedstuffByFeedstuffIdResult).to.be.null;
            });
        });
    });

    describe('findUserFeedstuffByFeedstuffId', () => {

        let feedstuffRepository: FeedstuffRepository = null;
        let userRepository: UserRepository = null;
        let base: Base = null;

        let feedstuffId: string = null;

        beforeEach(() => {
            base = new Base(config.db);
            feedstuffRepository = new FeedstuffRepository(config.db);
            userRepository = new UserRepository(config.db);
        });

        afterEach((done: () => void) => {
            const p1 = base.queryForTest('DELETE FROM users WHERE `username` = \'User1\'');
            const p2 = base.queryForTest('DELETE FROM userFeedstuffs WHERE `id` = \'' + feedstuffId + '\'');

            Promise.all([
                p1,
                p2,
            ]).then((result) => {
                done();
            });
        });

        it('should return null given feedstuff id and valid username', () => {

            return co(function*() {

                const findUserFeedstuffByFeedstuffIdResult: DomainFeedstuff[] = yield feedstuffRepository.findUserFeedstuffByFeedstuffId('36995DEF-9B6B-49CD-9AA6-0165478BA4CD', 'User1');

                expect(findUserFeedstuffByFeedstuffIdResult).to.be.null;
            });
        });

        it('should return feedstuff given user feedstuff id and valid username', () => {

            return co(function*() {

                const insertUserResult = yield userRepository.insertUser('User1');

                feedstuffId = uuid.v4();
                const insertUserFeedstuffResult = yield feedstuffRepository.insertUserFeedstuff('User1', feedstuffId, 'Feedstuff1', 'Feedstuff1');

                const findUserFeedstuffByFeedstuffIdResult: DomainFeedstuff[] = yield feedstuffRepository.findUserFeedstuffByFeedstuffId(feedstuffId, 'User1');

                expect(findUserFeedstuffByFeedstuffIdResult).to.be.not.null;
            });
        });

        it('should return null given user feedstuff id and invalid username', () => {

            return co(function*() {

                const insertUserResult = yield userRepository.insertUser('User1');

                feedstuffId = uuid.v4();
                const insertUserFeedstuffResult = yield feedstuffRepository.insertUserFeedstuff('User1', feedstuffId, 'Feedstuff1', 'Feedstuff1');

                const findUserFeedstuffByFeedstuffIdResult: DomainFeedstuff[] = yield feedstuffRepository.findUserFeedstuffByFeedstuffId(feedstuffId, 'User2');

                expect(findUserFeedstuffByFeedstuffIdResult).to.be.null;
            });
        });
    });

    describe('findSuggestedValuesByFormulaIdAndFeedstuffId', () => {

        let feedstuffRepository: FeedstuffRepository = null;
        beforeEach(() => {
            feedstuffRepository = new FeedstuffRepository(config.db);
        });

        afterEach((done: () => void) => {
            done();
        });

        it('should return suggested value given feedstuff id and formula with suggested value', () => {

            return co(function*() {

                const findSuggestedValuesByFormulaIdAndFeedstuffIdResult: DomainSuggestedValue =
                    yield feedstuffRepository.findSuggestedValuesByFormulaIdAndFeedstuffId('3A7406B5-3518-4EA9-B37D-09102CA4555C', 'B3EDBFD3-CB3C-4427-A6FB-B20EBF4FC831');

                expect(findSuggestedValuesByFormulaIdAndFeedstuffIdResult).to.be.not.null;
            });
        });

        it('should return null given feedstuff id and formula with no suggested value', () => {

            return co(function*() {

                const findSuggestedValuesByFormulaIdAndFeedstuffIdResult: DomainSuggestedValue =
                    yield feedstuffRepository.findSuggestedValuesByFormulaIdAndFeedstuffId('3A7406B5-3518-4EA9-B37D-09102CA4555C', 'C7366B10-57AA-4110-8AE7-8590B1734D37');

                expect(findSuggestedValuesByFormulaIdAndFeedstuffIdResult).to.be.null;
            });
        });
    });

    describe('listElementsByFeedstuffId', () => {

        let feedstuffRepository: FeedstuffRepository = null;
        let userRepository: UserRepository = null;
        let base: Base = null;

        let feedstuffId: string = null;

        beforeEach(() => {
            base = new Base(config.db);
            feedstuffRepository = new FeedstuffRepository(config.db);
            userRepository = new UserRepository(config.db);
        });

        afterEach((done: () => void) => {
            const p1 = base.queryForTest('DELETE FROM users WHERE `username` = \'User1\'');
            const p2 = base.queryForTest('DELETE FROM userFeedstuffs WHERE `id` = \'' + feedstuffId + '\'');

            Promise.all([
                p1,
                p2,
            ]).then((result) => {
                done();
            });
        });

        it('should return list of elements given feedstuff id', () => {

            return co(function*() {

                const listElementsByFeedstuffIdResult: DomainElement[] = yield feedstuffRepository.listElementsByFeedstuffId('C7366B10-57AA-4110-8AE7-8590B1734D37');

                expect(listElementsByFeedstuffIdResult.length).to.be.eq(80);
            });
        });

        it('should return list of elements given user feedstuff id', () => {

            return co(function*() {

                const insertUserResult = yield userRepository.insertUser('User1');

                feedstuffId = uuid.v4();
                const insertUserFeedstuffResult = yield feedstuffRepository.insertUserFeedstuff('User1', feedstuffId, 'Feedstuff1', 'Feedstuff1');

                const listElementsByFeedstuffIdResult: DomainElement[] = yield feedstuffRepository.listElementsByFeedstuffId(feedstuffId);

                expect(listElementsByFeedstuffIdResult.length).to.be.eq(0);
            });
        });
    });

    describe('listElementsByUserFeedstuffId', () => {

        let feedstuffRepository: FeedstuffRepository = null;
        let userRepository: UserRepository = null;
        let base: Base = null;

        let feedstuffId: string = null;

        beforeEach(() => {
            base = new Base(config.db);
            feedstuffRepository = new FeedstuffRepository(config.db);
            userRepository = new UserRepository(config.db);
        });

        afterEach((done: () => void) => {
            const p1 = base.queryForTest('DELETE FROM users WHERE `username` = \'User1\'');
            const p2 = base.queryForTest('DELETE FROM userFeedstuffs WHERE `id` = \'' + feedstuffId + '\'');
            const p3 = base.queryForTest('DELETE FROM userFeedstuffMeasurements WHERE `feedstuffId` = \'' + feedstuffId + '\'');

            Promise.all([
                p1,
                p2,
                p3,
            ]).then((result) => {
                done();
            });
        });

        it('should return list of elements given feedstuff id', () => {

            return co(function*() {

                const listElementsByUserFeedstuffIdResult: DomainElement[] = yield feedstuffRepository.listElementsByUserFeedstuffId('C7366B10-57AA-4110-8AE7-8590B1734D37', 'User1');

                expect(listElementsByUserFeedstuffIdResult.length).to.be.eq(0);
            });
        });

        it('should return list of elements given user feedstuff id', () => {

            return co(function*() {

                const insertUserResult = yield userRepository.insertUser('User1');

                feedstuffId = uuid.v4();
                const insertUserFeedstuffResult = yield feedstuffRepository.insertUserFeedstuff('User1', feedstuffId, 'Feedstuff1', 'Feedstuff1');

                const insertUserFeedstuffMeasurementResult = yield feedstuffRepository.insertUserFeedstuffMeasurement(feedstuffId, 'CF7FD851-DFC0-4680-96D3-00F9DBC9469C', 50, 'User1');

                const listElementsByUserFeedstuffIdResult: DomainElement[] = yield feedstuffRepository.listElementsByUserFeedstuffId(feedstuffId, 'User1');

                expect(listElementsByUserFeedstuffIdResult.length).to.be.eq(1);
            });
        });
    });
});

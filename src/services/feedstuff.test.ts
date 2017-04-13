import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports services
import { FeedstuffService } from './feedstuff';

// Imports repositories
import { MockElementRepository } from './../repositories/mock/element';
import { MockFeedstuffRepository } from './../repositories/mock/feedstuff';

// Imports domain models
import { Element as DomainElement } from './../models/element';
import { Feedstuff as DomainFeedstuff } from './../models/feedstuff';
import { FeedstuffMeasurement as DomainFeedstuffMeasurement } from './../models/feedstuff-measurement';
import { SuggestedValue as DomainSuggestedValue } from './../models/suggested-value';

describe('FeedstuffService', () => {

    describe('populateElementsOfFeedstuffs', () => {

        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'listElementsByFeedstuffId').callsFake((feedstuffId: string) => {
                if (feedstuffId === '1' || feedstuffId === '2') {
                    return Promise.resolve([
                        new DomainFeedstuffMeasurement('1', 'Element1', 0, '%', 0),
                    ]);
                } else {
                    return Promise.resolve([]);
                }
            });

            sinon.stub(feedstuffRepository, 'listElementsByUserFeedstuffId').callsFake((feedstuffId: string) => {
                if (feedstuffId === '5' || feedstuffId === '6') {
                    return Promise.resolve([
                        new DomainFeedstuffMeasurement('1', 'Element1', 0, '%', 0),
                        new DomainFeedstuffMeasurement('2', 'Element2', 0, '%', 0),
                    ]);
                } else {
                    return Promise.resolve([]);
                }
            });

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return list of feedstuffs where elements are populated', () => {

            return co(function*() {
                const populateElementsOfFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.populateElementsOfFeedstuffs(
                    [
                        new DomainFeedstuff('1', null, 10, 100, 5000),
                        new DomainFeedstuff('2', null, 10, 100, 5000),
                    ], 'ValidUsername',
                );

                expect(populateElementsOfFeedstuffsResult).to.be.not.null;
                expect(populateElementsOfFeedstuffsResult.length).to.be.eq(2);

                expect(populateElementsOfFeedstuffsResult[0].elements).to.be.not.null;
                expect(populateElementsOfFeedstuffsResult[1].elements).to.be.not.null;

                expect(populateElementsOfFeedstuffsResult[0].elements.length).to.be.eq(1);
                expect(populateElementsOfFeedstuffsResult[1].elements.length).to.be.eq(1);
            });
        });

        it('should return list of feedstuffs where elements are populated given user feedstuffs', () => {
            return co(function*() {
                const populateElementsOfFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.populateElementsOfFeedstuffs(
                    [
                        new DomainFeedstuff('5', null, 10, 100, 5000),
                        new DomainFeedstuff('6', null, 10, 100, 5000),
                    ], 'ValidUsername',
                );

                expect(populateElementsOfFeedstuffsResult).to.be.not.null;
                expect(populateElementsOfFeedstuffsResult.length).to.be.eq(2);

                expect(populateElementsOfFeedstuffsResult[0].elements).to.be.not.null;
                expect(populateElementsOfFeedstuffsResult[1].elements).to.be.not.null;

                expect(populateElementsOfFeedstuffsResult[0].elements.length).to.be.eq(2);
                expect(populateElementsOfFeedstuffsResult[1].elements.length).to.be.eq(2);
            });
        });
    });

    describe('populateNamesOfFeedstuffs', () => {

        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'findFeedstuffByFeedstuffId').callsFake((feedstuffId: string) => {
                if (feedstuffId === '1' || feedstuffId === '2') {
                    return Promise.resolve(new DomainFeedstuff(feedstuffId, 'Feedstuff' + feedstuffId, 0, 0, 0));
                } else {
                    return Promise.resolve(null);
                }
            });

            sinon.stub(feedstuffRepository, 'findUserFeedstuffByFeedstuffId').callsFake((feedstuffId: string) => {
                if (feedstuffId === '5' || feedstuffId === '6') {
                    return Promise.resolve(new DomainFeedstuff(feedstuffId, 'Feedstuff' + feedstuffId, 0, 0, 0));
                } else {
                    return Promise.resolve(null);
                }
            });

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return list of feedstuffs where feedstuffs names are populated', () => {
            return co(function*() {
                const populateNamesOfFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.populateNamesOfFeedstuffs(
                    [
                        new DomainFeedstuff('1', null, 10, 100, 5000),
                        new DomainFeedstuff('2', null, 10, 100, 5000),
                    ],
                    null,
                );
                expect(populateNamesOfFeedstuffsResult).to.be.not.null;
                expect(populateNamesOfFeedstuffsResult.length).to.be.eq(2);

                expect(populateNamesOfFeedstuffsResult[0].name).to.be.not.null;
                expect(populateNamesOfFeedstuffsResult[1].name).to.be.not.null;
            });
        });

        it('should return list of feedstuffs where feedstuffs names are populated given user feedstuffs', () => {
            return co(function*() {
                const populateNamesOfFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.populateNamesOfFeedstuffs(
                    [
                        new DomainFeedstuff('5', null, 10, 100, 5000),
                        new DomainFeedstuff('6', null, 10, 100, 5000),
                    ],
                    'ValidUsername',
                );

                expect(populateNamesOfFeedstuffsResult).to.be.not.null;
                expect(populateNamesOfFeedstuffsResult.length).to.be.eq(2);

                expect(populateNamesOfFeedstuffsResult[0].name).to.be.not.null;
                expect(populateNamesOfFeedstuffsResult[1].name).to.be.not.null;
            });
        });
    });

    describe('listFeedstuffs', () => {

        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'listFeedstuffs').callsFake((username: string) => {
                if (username === 'ValidUsername') {
                    return Promise.resolve([
                        new DomainFeedstuff('1', 'Feedstuff1', null, null, null),
                        new DomainFeedstuff('2', 'Feedstuff2', null, null, null),
                        new DomainFeedstuff('3', 'Feedstuff3', null, null, null),
                        new DomainFeedstuff('4', 'Feedstuff4', null, null, null),
                        new DomainFeedstuff('5', 'Feedstuff5', null, null, null),
                        new DomainFeedstuff('6', 'Feedstuff6', null, null, null),
                        new DomainFeedstuff('7', 'Feedstuff7', null, null, null),
                    ]);
                } else {
                    return Promise.resolve([
                        new DomainFeedstuff('1', 'Feedstuff1', null, null, null),
                        new DomainFeedstuff('2', 'Feedstuff2', null, null, null),
                        new DomainFeedstuff('3', 'Feedstuff3', null, null, null),
                        new DomainFeedstuff('4', 'Feedstuff4', null, null, null),
                    ]);
                }
            });

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return list of feedstuffs given null username', () => {
            return co(function*() {
                const listFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.listFeedstuffs(null);

                expect(listFeedstuffsResult.length).to.be.eq(4);
            });
        });

        it('should return list of feedstuffs given valid username', () => {
            return co(function*() {
                const listFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.listFeedstuffs('ValidUsername');

                expect(listFeedstuffsResult.length).to.be.eq(7);
            });
        });
    });

    describe('listExampleFeedstuffs', () => {

        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'listExampleFeedstuffs').callsFake(() => {
                return Promise.resolve([
                    new DomainFeedstuff('1', 'Feedstuff1', 50, 1000, 600),
                    new DomainFeedstuff('2', 'Feedstuff2', 200, 800, 300),
                    new DomainFeedstuff('3', 'Feedstuff3', 100, 700, 400),
                ]);
            });

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return list of feedstuffs', () => {
            return co(function*() {
                const listExampleFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.listExampleFeedstuffs();

                expect(listExampleFeedstuffsResult.length).to.be.eq(3);
            });
        });
    });

    describe('findSuggestedValues', () => {

        const findSuggestedValuesByFormulaIdAndFeedstuffIdSpy: sinon.SinonSpy = null;
        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'findSuggestedValuesByFormulaIdAndFeedstuffId').callsFake((formulaId: string, feedstuffId: string) => {
                if (formulaId === '1' && feedstuffId === '1') {
                    return Promise.resolve(new DomainSuggestedValue(0, 1000));
                } else {
                    return Promise.resolve(null);
                }
            });

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return suggested value', () => {
            return co(function*() {
                const findSuggestedValuesResult: DomainSuggestedValue = yield feedstuffService.findSuggestedValues('1', '1');

                expect(findSuggestedValuesResult).to.be.not.null;
            });
        });
    });

    describe('listUserFeedstuffs', () => {

        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'listFeedstuffsByUsername').callsFake((username: string) => {
                if (username === null) {
                    return Promise.resolve([]);
                } else {
                    return Promise.resolve([
                        new DomainFeedstuff('1', 'Feedstuff1', 50, 1000, 600),
                        new DomainFeedstuff('2', 'Feedstuff2', 200, 800, 300),
                        new DomainFeedstuff('3', 'Feedstuff3', 100, 700, 400),
                    ]);
                }
            });

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return list of feedstuffs given null username', () => {
            return co(function*() {
                const listUserFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.listUserFeedstuffs(null);

                expect(listUserFeedstuffsResult.length).to.be.eq(0);
            });
        });

        it('should return list of feedstuffs given valid username', () => {
            return co(function*() {
                const listUserFeedstuffsResult: DomainFeedstuff[] = yield feedstuffService.listUserFeedstuffs('ValidUsername');

                expect(listUserFeedstuffsResult.length).to.be.eq(3);
            });
        });
    });

    describe('createUserFeedstuff', () => {

        let insertUserFeedstuffSpy: sinon.SinonSpy = null;
        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            insertUserFeedstuffSpy = sinon.spy(feedstuffRepository, 'insertUserFeedstuff');

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should be inserted into repository', () => {
            return co(function*() {
                const createUserFeedstuffResult: DomainFeedstuff = yield feedstuffService.createUserFeedstuff('ValidUsername', 'Feedstuff9', null);

                sinon.assert.calledOnce(insertUserFeedstuffSpy);
            });
        });
    });

    describe('findUserFeedstuff', () => {

        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'findUserFeedstuffByFeedstuffId').callsFake((feedstuffId: string, username: string) => {
                if (username === null) {
                    return Promise.resolve(null);
                } else if (feedstuffId === '5') {
                    return Promise.resolve(new DomainFeedstuff(feedstuffId, 'Feedstuff' + feedstuffId, 50, 1000, 600));
                }
            });

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return null given null username with valid user feedstuff id', () => {
            return co(function*() {
                const findUserFeedstuffResult: DomainFeedstuff = yield feedstuffService.findUserFeedstuff('5', null);

                expect(findUserFeedstuffResult).to.be.null;
            });
        });

        it('should return feedstuff given valid username with valid user feedstuff id', () => {
            return co(function*() {
                const findUserFeedstuffResult: DomainFeedstuff = yield feedstuffService.findUserFeedstuff('5', 'ValidUsername');

                expect(findUserFeedstuffResult).to.be.not.null;
            });
        });

        it('should return null given null username with valid feedstuff id', () => {
            return co(function*() {
                const findUserFeedstuffResult: DomainFeedstuff = yield feedstuffService.findUserFeedstuff('1', null);

                expect(findUserFeedstuffResult).to.be.null;
            });
        });
    });

    describe('listUserFeedstuffMeasurements', () => {

        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'listElementsByUserFeedstuffId').callsFake((feedstuffId: string, username: string) => {
                if (feedstuffId === '5') {
                    return Promise.resolve([
                        new DomainFeedstuffMeasurement('1', 'Element1', 0, '%', 0),
                    ]);
                } else {
                    return Promise.resolve([]);
                }
            });

            sinon.stub(elementRepository, 'listElements').callsFake(() => {
                return Promise.resolve([
                    new DomainElement('1', 'Element1', 0, 0, 0, '%', 0),
                    new DomainElement('2', 'Element2', 0, 0, 0, '%', 0),
                    new DomainElement('3', 'Element3', 0, 0, 0, '%', 0),
                    new DomainElement('4', 'Element4', 0, 0, 0, '%', 0),
                    new DomainElement('5', 'Element5', 0, 0, 0, '%', 0),
                ]);
            });

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return list of feedstuff measurements given valid user feedstuff id', () => {
            return co(function*() {
                const listUserFeedstuffMeasurementsResult: DomainFeedstuffMeasurement[] = yield feedstuffService.listUserFeedstuffMeasurements('5', 'ValidUsername');

                expect(listUserFeedstuffMeasurementsResult).to.be.not.null;
                expect(listUserFeedstuffMeasurementsResult.length).to.be.eq(1);
            });
        });

        it('should return list of feedstuff measurements given valid user feedstuff id with no feedstuff measurements', () => {
            return co(function*() {
                const listUserFeedstuffMeasurementsResult: DomainFeedstuffMeasurement[] = yield feedstuffService.listUserFeedstuffMeasurements('7', 'ValidUsername');

                expect(listUserFeedstuffMeasurementsResult).to.be.not.null;
                expect(listUserFeedstuffMeasurementsResult.length).to.be.eq(5);
            });
        });
    });

    describe('saveUserFeedstuffMeasurements', () => {

        let insertUserFeedstuffMeasurementSpy: sinon.SinonSpy = null;
        let updateUserFeedstuffMeasurementSpy: sinon.SinonSpy = null;
        let feedstuffService: FeedstuffService = null;

        beforeEach(() => {

            const feedstuffRepository = new MockFeedstuffRepository(null);
            const elementRepository = new MockElementRepository(null);

            sinon.stub(feedstuffRepository, 'listElementsByUserFeedstuffId').callsFake((feedstuffId: string, username: string) => {
                if (feedstuffId === '5') {
                    return Promise.resolve([
                        new DomainFeedstuffMeasurement('1', 'Element1', 5, null, null),
                    ]);
                }
            });

            insertUserFeedstuffMeasurementSpy = sinon.spy(feedstuffRepository, 'insertUserFeedstuffMeasurement');
            updateUserFeedstuffMeasurementSpy = sinon.spy(feedstuffRepository, 'updateUserFeedstuffMeasurement');

            feedstuffService = new FeedstuffService(feedstuffRepository, elementRepository);
        });

        it('should return true', () => {
            return co(function*() {
                const saveUserFeedstuffMeasurementsResult: boolean = yield feedstuffService.saveUserFeedstuffMeasurements('5', [
                    new DomainFeedstuffMeasurement('2', 'Element2', 10, null, null),
                ], 'ValidUsername');

                expect(saveUserFeedstuffMeasurementsResult).to.be.true;
            });
        });

        it('should call insertUserFeedstuffMeasurement on repository', () => {
            return co(function*() {
                const saveUserFeedstuffMeasurementsResult: boolean = yield feedstuffService.saveUserFeedstuffMeasurements('5', [
                    new DomainFeedstuffMeasurement('2', 'Element2', 10, null, null),
                ], 'ValidUsername');

                sinon.assert.calledOnce(insertUserFeedstuffMeasurementSpy);
            });
        });

        it('should call updateUserFeedstuffMeasurement on repository', () => {
            return co(function*() {
                const saveUserFeedstuffMeasurementsResult: boolean = yield feedstuffService.saveUserFeedstuffMeasurements('5', [
                    new DomainFeedstuffMeasurement('1', 'Element1', 10, null, null),
                ], 'ValidUsername');

                sinon.assert.calledOnce(updateUserFeedstuffMeasurementSpy);
            });
        });
    });

});

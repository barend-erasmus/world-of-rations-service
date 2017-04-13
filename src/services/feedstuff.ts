// Imports
import * as co from 'co';
import * as uuid from 'uuid';
import { IElementRepository } from './../repositories/element';
import { IFeedstuffRepository } from './../repositories/feedstuff';

// Imports domain models
import { Element as DomainElement } from './../models/element';
import { Feedstuff as DomainFeedstuff } from './../models/feedstuff';
import { FeedstuffMeasurement as DomainFeedstuffMeasurement } from './../models/feedstuff-measurement';
import { SuggestedValue as DomainSuggestedValue } from './../models/suggested-value';

export class FeedstuffService {

    constructor(private feedstuffRepository: IFeedstuffRepository, private elementRepository: IElementRepository) {
    }

    public listFeedstuffs(username: string): Promise<DomainFeedstuff[]> {
        return this.feedstuffRepository.listFeedstuffs(username);
    }

    public listExampleFeedstuffs(): Promise<DomainFeedstuff[]> {
        return this.feedstuffRepository.listExampleFeedstuffs();
    }

    public findSuggestedValues(formulaId: string, feedstuffId: string): Promise<DomainSuggestedValue> {
        return this.feedstuffRepository.findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId, feedstuffId);
    }

    public populateElementsOfFeedstuffs(feedstuffs: DomainFeedstuff[], username: string): Promise<DomainFeedstuff[]> {
        const self = this;

        return co(function*() {

            const listOfPromise = [];
            for (const feedstuff of feedstuffs) {
                listOfPromise.push(self.populateElementsOfFeedstuff(feedstuff, username));
            }

            const feedstuffsResult: DomainFeedstuff[] = yield listOfPromise;

            return feedstuffsResult;
        });
    }

    public populateNamesOfFeedstuffs(feedstuffs: DomainFeedstuff[], username: string): Promise<DomainFeedstuff[]> {
        const self = this;

        return co(function*() {

            const listOfPromise = [];
            for (const feedstuff of feedstuffs) {
                listOfPromise.push(self.populateNameOfFeedstuff(feedstuff, username));
            }

            const feedstuffsResult: DomainFeedstuff[] = yield listOfPromise;

            return feedstuffsResult;
        });
    }

    public listUserFeedstuffs(username: string): Promise<DomainFeedstuff[]> {
        return this.feedstuffRepository.listFeedstuffsByUsername(username);
    }

    public createUserFeedstuff(username: string, name: string, description: string): Promise<DomainFeedstuff> {
        const self = this;

        return co(function*() {
            const id = uuid.v4();

            const insertUserFeedstuff: any[] = yield self.feedstuffRepository.insertUserFeedstuff(username, id, name, description);

            return new DomainFeedstuff(id, name, null, null, null);
        });
    }

    public findUserFeedstuff(feedstuffId: string, username: string): Promise<DomainFeedstuff> {
        return this.feedstuffRepository.findUserFeedstuffByFeedstuffId(feedstuffId, username);
    }

    public saveUserFeedstuffMeasurements(feedstuffId: string, measurements: DomainFeedstuffMeasurement[], username: string): Promise<boolean> {
        const self = this;

        return co(function*() {

            const listElementsByUserFeedstuffIdResult: DomainFeedstuffMeasurement[] = yield self.feedstuffRepository.listElementsByUserFeedstuffId(feedstuffId, username);

            const tasksInsert = measurements.filter((x) => listElementsByUserFeedstuffIdResult.find((y) => y.id === x.id) === undefined).map((x) => self.feedstuffRepository.insertUserFeedstuffMeasurement(feedstuffId, x.id, x.value, username));

            const tasksUpdate = measurements.filter((x) => listElementsByUserFeedstuffIdResult.find((y) => y.id === x.id) !== undefined).map((x) => self.feedstuffRepository.updateUserFeedstuffMeasurement(feedstuffId, x.id, x.value, username));

            const results: any[] = yield [tasksInsert, tasksUpdate];

            return true;
        });
    }

    public listUserFeedstuffMeasurements(feedstuffId: string, username: string): Promise<DomainFeedstuffMeasurement[]> {
        const self = this;

        return co(function*() {
            const listElementsByUserFeedstuffIdResult: DomainFeedstuffMeasurement[] = yield self.feedstuffRepository.listElementsByUserFeedstuffId(feedstuffId, username);

            if (listElementsByUserFeedstuffIdResult.length === 0) {
                const listElementsResult: DomainElement[] = yield self.elementRepository.listElements();
                return listElementsResult.map((x) => new DomainFeedstuffMeasurement(x.id, x.name, x.value, x.unit, x.sortOrder));
            }

            return listElementsByUserFeedstuffIdResult;
        });

    }

    private populateElementsOfFeedstuff(feedstuff: DomainFeedstuff, username: string): Promise<DomainFeedstuff> {
        const self = this;

        return co(function*() {
            const listElementsByFeedstuffIdResult: DomainFeedstuffMeasurement[] = yield self.feedstuffRepository.listElementsByFeedstuffId(feedstuff.id);

            const listElementsByUserFeedstuffIdResult: DomainFeedstuffMeasurement[] = yield self.feedstuffRepository.listElementsByUserFeedstuffId(feedstuff.id, username);

            if (listElementsByFeedstuffIdResult !== null && listElementsByFeedstuffIdResult.length !== 0) {
                feedstuff.elements = listElementsByFeedstuffIdResult;
            }

            if (listElementsByUserFeedstuffIdResult !== null && listElementsByUserFeedstuffIdResult.length !== 0) {
                feedstuff.elements = listElementsByUserFeedstuffIdResult;
            }

            return feedstuff;
        });
    }

    private populateNameOfFeedstuff(feedstuff: DomainFeedstuff, username: string): Promise<DomainFeedstuff> {
        const self = this;

        return co(function*() {
            const findFeedstuffByFeedstuffIdResult: DomainFeedstuff = yield self.feedstuffRepository.findFeedstuffByFeedstuffId(feedstuff.id);

            const findUserFeedstuffByFeedstuffIdResult: DomainFeedstuff = yield self.feedstuffRepository.findUserFeedstuffByFeedstuffId(feedstuff.id, username);

            if (findFeedstuffByFeedstuffIdResult !== null) {
                feedstuff.name = findFeedstuffByFeedstuffIdResult.name;
            }

            if (findUserFeedstuffByFeedstuffIdResult !== null) {
                feedstuff.name = findUserFeedstuffByFeedstuffIdResult.name;
            }

            return feedstuff;
        });
    }
}

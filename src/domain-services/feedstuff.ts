// Imports
import * as co from 'co';
import * as uuid from 'uuid';

// Imports interfaces
import { IElementRepository } from './../domain-repositories/element';
import { IFeedstuffRepository } from './../domain-repositories/feedstuff';
import { ICacheService } from './interfaces/cache';

// Imports models
import { Element } from './../domain-models/element';
import { Feedstuff } from './../domain-models/feedstuff';
import { FeedstuffElement } from './../domain-models/feedstuff-element';
import { FormulationFeedstuff } from './../domain-models/formulation-feedstuff';
import { SuggestedValue } from './../domain-models/suggested-value';

export class FeedstuffService {

    constructor(private cacheService: ICacheService, private feedstuffRepository: IFeedstuffRepository, private elementRepository: IElementRepository) {
    }

    public listFeedstuffs(): Promise<Feedstuff[]> {
        const self = this;

        return co(function* () {

            const cachedResult: Feedstuff[] = yield self.cacheService.find({
                key: "FeedstuffService.listFeedstuffs",
            });

            if (cachedResult !== null) {
                return cachedResult.map((x) => Feedstuff.mapFeedstuff(x));
            }

            const result: Feedstuff[] = yield self.feedstuffRepository.list();

            yield self.cacheService.add({
                key: "FeedstuffService.listFeedstuffs",
            }, result, 24 * 60 * 60);

            if (result.filter((x) => !x.isValid()).length > 0) {
                throw new Error('Validation Failed');
            }

            return result;
        });
    }

    public listExampleFeedstuffs(): Promise<FormulationFeedstuff[]> {

        const self = this;

        return co(function* () {

            const cachedResult: FormulationFeedstuff[] = yield self.cacheService.find({
                key: "FeedstuffService.listExampleFeedstuffs",
            });

            if (cachedResult !== null) {
                return cachedResult.map((x) => FormulationFeedstuff.mapFormulationFeedstuff(x));
            }

            const result: FormulationFeedstuff[] = yield self.feedstuffRepository.examples();

            yield self.cacheService.add({
                key: "FeedstuffService.listExampleFeedstuffs",
            }, result, 24 * 60 * 60);

            if (result.filter((x) => !x.isValid()).length > 0) {
                throw new Error('Validation Failed');
            }

            return result;
        });
    }

    public findSuggestedValues(formulaId: string, feedstuffId: string): Promise<SuggestedValue> {
        const self = this;

        return co(function* () {
            const result: SuggestedValue = yield self.feedstuffRepository.findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId, feedstuffId);

            if (result === null) {
                return null;
            }
            
            if (!result.isValid()) {
                throw new Error('Validation Failed');
            }

            return result;
        });
    }

    public listUserFeedstuffs(username: string): Promise<Feedstuff[]> {
        const self = this;

        return co(function* () {
            const result: Feedstuff[] = yield self.feedstuffRepository.listByUsername(username);

            if (result.filter((x) => !x.isValid()).length > 0) {
                throw new Error('Validation Failed');
            }

            return result;
        });
    }

    public createUserFeedstuff(username: string, name: string, description: string): Promise<Feedstuff> {
        const self = this;

        return co(function* () {
            const id = uuid.v4();

            const feedstuff: Feedstuff = new Feedstuff(id, name, null, null, username);

            const elements: Element[] = yield self.elementRepository.list();
            feedstuff.elements = elements.map((x) => new FeedstuffElement(x.id, x.name, x.unit, x.code, x.sortOrder, 0));

            const success: boolean = yield self.feedstuffRepository.create(feedstuff);

            if (!feedstuff.isValid()) {
                throw new Error('Validation Failed');
            }

            return feedstuff;
        });
    }

    public updateUserFeedstuff(id: string, name: string, description: string, elements: FeedstuffElement[]): Promise<Feedstuff> {
        const self = this;

        return co(function* () {

            const feedstuff: Feedstuff = yield self.feedstuffRepository.findById(id);

            feedstuff.name = name;
            feedstuff.elements = elements;

            const success: boolean = yield self.feedstuffRepository.update(feedstuff);

            if (!feedstuff.isValid()) {
                throw new Error('Validation Failed');
            }

            return feedstuff;
        });
    }

    public findUserFeedstuff(feedstuffId: string, username: string): Promise<Feedstuff> {
        const self = this;

        return co(function* () {

            const feedstuff: Feedstuff = yield self.feedstuffRepository.findById(feedstuffId);

            if (feedstuff.username !== username) {
                return null;
            }

            if (!feedstuff.isValid()) {
                throw new Error('Validation Failed');
            }

            return feedstuff;
        });
    }
}

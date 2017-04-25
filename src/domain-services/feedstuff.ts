// Imports
import * as co from 'co';
import * as uuid from 'uuid';

// Imports interfaces
import { IElementRepository } from './../domain-repositories/element';
import { IFeedstuffRepository } from './../domain-repositories/feedstuff';

// Imports models
import { Element } from './../domain-models/element';
import { Feedstuff } from './../domain-models/feedstuff';
import { FeedstuffElement } from './../domain-models/feedstuff-element';
import { FormulationFeedstuff } from './../domain-models/formulation-feedstuff';
import { SuggestedValue } from './../domain-models/suggested-value';

export class FeedstuffService {

    constructor(private feedstuffRepository: IFeedstuffRepository, private elementRepository: IElementRepository) {
    }

    public listFeedstuffs(): Promise<Feedstuff[]> {
        return this.feedstuffRepository.list();
    }

    public listExampleFeedstuffs(): Promise<FormulationFeedstuff[]> {
        return this.feedstuffRepository.examples();
    }

    public findSuggestedValues(formulaId: string, feedstuffId: string): Promise<SuggestedValue> {
        return this.feedstuffRepository.findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId, feedstuffId);
    }

    public listUserFeedstuffs(username: string): Promise<Feedstuff[]> {
        return this.feedstuffRepository.listByUsername(username);
    }

    public createUserFeedstuff(username: string, name: string, description: string): Promise<Feedstuff> {
        const self = this;

        return co(function*() {
            const id = uuid.v4();

            const feedstuff: Feedstuff = new Feedstuff(id, name, null, null, username);

            const elements: Element[] = yield self.elementRepository.list();
            feedstuff.elements = elements.map((x) => new FeedstuffElement(x.id, x.name, x.unit, x.sortOrder, 0));

            const success: boolean = yield self.feedstuffRepository.create(feedstuff);

            return feedstuff;
        });
    }

    public updateUserFeedstuff(id: string, name: string, description: string, elements: FeedstuffElement[]): Promise<Feedstuff> {
        const self = this;

        return co(function*() {

            const feedstuff: Feedstuff = yield self.feedstuffRepository.findById(id);

            feedstuff.name = name;
            feedstuff.elements = elements;

            const success: boolean = yield self.feedstuffRepository.update(feedstuff);

            return feedstuff;
        });
    }

    public findUserFeedstuff(feedstuffId: string, username: string): Promise<Feedstuff> {
        const self = this;

        return co(function*() {

            const feedstuff: Feedstuff = yield self.feedstuffRepository.findById(feedstuffId);

            if (feedstuff.username !== username) {
                return null;
            }

            return feedstuff;
        });
    }
}

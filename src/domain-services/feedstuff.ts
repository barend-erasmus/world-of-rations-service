// Imports
import * as co from 'co';
import * as uuid from 'uuid';

// Imports interfaces
import { IFeedstuffRepository } from './../domain-repositories/feedstuff';
import { IElementRepository } from './../repositories/element';

// Imports domain models
import { Element } from './../domain-models/element';
import { Feedstuff } from './../domain-models/feedstuff';
import { FeedstuffElement } from './../domain-models/feedstuff-element';
import { SuggestedValue } from './../domain-models/suggested-value';

export class FeedstuffService {

    constructor(private feedstuffRepository: IFeedstuffRepository, private elementRepository: IElementRepository) {
    }

    public listFeedstuffs(username: string): Promise<Feedstuff[]> {
        return this.feedstuffRepository.list();
    }

    public listExampleFeedstuffs(): Promise<Feedstuff[]> {
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

            const success: boolean = yield self.feedstuffRepository.create(feedstuff);

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

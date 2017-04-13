// Imports
import { IFeedstuffRepository } from './../feedstuff';

// Imports domain models
import { CompositionElement as DomainCompositionElement } from './../../models/composition-element';
import { Feedstuff as DomainFeedstuff } from './../../models/feedstuff';
import { FeedstuffMeasurement as DomainFeedstuffMeasurement } from './../../models/feedstuff-measurement';
import { SuggestedValue as DomainSuggestedValue } from './../../models/suggested-value';
import { SupplementElement as DomainSupplementElement } from './../../models/supplement-element';
import { SupplementFeedstuff as DomainSupplementFeedstuff } from './../../models/supplement-feedstuff';

// Imports data models
import { ExampleFeedstuff as DataExampleFeedstuff } from './../../data-models/example-feedstuff';
import { Feedstuff as DataFeedstuff } from './../../data-models/feedstuff';
import { FeedstuffMeasurement as DataFeedstuffMeasurement } from './../../data-models/feedstuff-measurement';
import { SuggestedValue as DataSuggestedValue } from './../../data-models/suggested-value';
import { SupplementFeedstuff as DataSupplementFeedstuff } from './../../data-models/supplement-feedstuff';

export class MockFeedstuffRepository implements IFeedstuffRepository {

    constructor(private config: any) {

    }

    public listFeedstuffs(username: string): Promise<DomainFeedstuff[]> {
        return Promise.resolve([]);
    }

    public listExampleFeedstuffs(): Promise<DomainFeedstuff[]> {
        return Promise.resolve([]);
    }

    public findFeedstuffByFeedstuffId(feedstuffId: string): Promise<DomainFeedstuff> {
        return Promise.resolve(null);
    }

    public findUserFeedstuffByFeedstuffId(feedstuffId: string, username: string): Promise<DomainFeedstuff> {
         return Promise.resolve(null);
    }

    public findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId: string, feedstuffId: string): Promise<DomainSuggestedValue> {
        return Promise.resolve(null);
    }

    public listElementsByFeedstuffId(feedstuffId: string): Promise<DomainFeedstuffMeasurement[]> {
         return Promise.resolve([]);
    }

    public listSupplementFeedstuffByElementId(element: DomainCompositionElement): Promise<DomainSupplementElement> {
         return Promise.resolve(null);
    }

    public listElementsByUserFeedstuffId(feedstuffId: string): Promise<DomainFeedstuffMeasurement[]> {
         return Promise.resolve([]);
    }

    public listFeedstuffsByUsername(username: string): Promise<DomainFeedstuff[]> {
         return Promise.resolve([]);
    }

    public insertUserFeedstuff(username: string, id: string, name: string, description: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public insertUserFeedstuffMeasurement(feedstuffId: string, elementId: string, value: number): Promise<boolean> {
        return Promise.resolve(true);
    }

    public updateUserFeedstuffMeasurement(feedstuffId: string, elementId: string, value: number): Promise<boolean> {
        return Promise.resolve(true);
    }
}

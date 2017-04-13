// Imports domain models
import { CompositionElement as DomainCompositionElement } from './../models/composition-element';
import { Feedstuff as DomainFeedstuff } from './../models/feedstuff';
import { FeedstuffMeasurement as DomainFeedstuffMeasurement } from './../models/feedstuff-measurement';
import { SuggestedValue as DomainSuggestedValue } from './../models/suggested-value';
import { SupplementElement as DomainSupplementElement } from './../models/supplement-element';

export interface IFeedstuffRepository {
    listFeedstuffs(username: string): Promise<DomainFeedstuff[]>;
    listExampleFeedstuffs(): Promise<DomainFeedstuff[]>;
    listElementsByFeedstuffId(feedstuffId: string): Promise<DomainFeedstuffMeasurement[]>;
    listSupplementFeedstuffByElementId(element: DomainCompositionElement): Promise<DomainSupplementElement>;
    listElementsByUserFeedstuffId(feedstuffId: string, username: string): Promise<DomainFeedstuffMeasurement[]>;
    listFeedstuffsByUsername(username: string): Promise<DomainFeedstuff[]>;

    findFeedstuffByFeedstuffId(feedstuffId: string): Promise<DomainFeedstuff>;
    findUserFeedstuffByFeedstuffId(feedstuffId: string, username: string): Promise<DomainFeedstuff>;
    findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId: string, feedstuffId: string): Promise<DomainSuggestedValue>;

    insertUserFeedstuff(username: string, id: string, name: string, description: string): Promise<boolean>;
    insertUserFeedstuffMeasurement(feedstuffId: string, elementId: string, value: number, username: string): Promise<boolean>;

    updateUserFeedstuffMeasurement(feedstuffId: string, elementId: string, value: number, username: string): Promise<boolean>;
}

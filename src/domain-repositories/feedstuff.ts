// Imports models
import { Feedstuff } from './../domain-models/feedstuff';
import { SuggestedValue } from './../domain-models/suggested-value';

export interface IFeedstuffRepository {

    list(): Promise<Feedstuff[]>;

    examples(): Promise<Feedstuff[]>;

    create(feedstuff: Feedstuff): Promise<boolean>;

    update(feedstuff: Feedstuff): Promise<boolean>;

    findById(id: string): Promise<Feedstuff>;

    listByUsername(username): Promise<Feedstuff[]>;

    findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId: string, feedstuffId: string): Promise<SuggestedValue>;

}
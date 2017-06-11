// Imports
import * as co from 'co';

// Imports interfaces
import { IFeedstuffRepository } from './../feedstuff';

// Imports models
import { CompositionElement } from './../../domain-models/composition-element';
import { Feedstuff } from './../../domain-models/feedstuff';
import { FormulationFeedstuff } from './../../domain-models/formulation-feedstuff';
import { SuggestedValue } from './../../domain-models/suggested-value';
import { SupplementElement } from './../../domain-models/supplement-element';

export class FeedstuffRepository implements IFeedstuffRepository {

    public list(): Promise<Feedstuff[]> {
        return Promise.resolve([]);
    }

    public examples(): Promise<FormulationFeedstuff[]> {
        return null;
    }

    public create(feedstuff: Feedstuff): Promise<boolean> {
        return null;
    }

    public update(feedstuff: Feedstuff): Promise<boolean> {
        return null;
    }

    public findById(id: string): Promise<Feedstuff> {
        return null;
    }

    public listByUsername(username): Promise<Feedstuff[]> {
        return null;
    }

    public findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId: string, feedstuffId: string): Promise<SuggestedValue> {
        return null;
    }

    public findSupplementFeedstuff(element: CompositionElement): Promise<SupplementElement> {
        return null;
    }
}

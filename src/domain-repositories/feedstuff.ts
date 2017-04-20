// Imports models
import { Feedstuff } from './../domain-models/feedstuff';
import { FormulationFeedstuff } from './../domain-models/formulation-feedstuff';
import { SuggestedValue } from './../domain-models/suggested-value';
import { SupplementElement } from './../domain-models/supplement-element';
import { CompositionElement } from './../domain-models/composition-element';

export interface IFeedstuffRepository {

    list(): Promise<Feedstuff[]>;

    examples(): Promise<FormulationFeedstuff[]>;

    create(feedstuff: Feedstuff): Promise<boolean>;

    update(feedstuff: Feedstuff): Promise<boolean>;

    findById(id: string): Promise<Feedstuff>;

    listByUsername(username): Promise<Feedstuff[]>;

    findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId: string, feedstuffId: string): Promise<SuggestedValue>;

    findSupplementFeedstuff(element: CompositionElement): Promise<SupplementElement>;
}

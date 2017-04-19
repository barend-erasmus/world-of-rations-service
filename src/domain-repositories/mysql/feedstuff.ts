// Imports
import { Base } from './base';

// Imports repositories
import { IFeedstuffRepository } from './../feedstuff';

// Imports models
import { Feedstuff } from './../../domain-models/feedstuff';
import { SuggestedValue } from './../../domain-models/suggested-value';

export class FeedstuffRepository extends Base implements IFeedstuffRepository{

    public list(): Promise<Feedstuff[]> {
        return co(function*() {
            const result: any[] = yield self.query(`CALL listFeedstuffs();`);

            return result.map((x) => new Feedstuff(x.id, x.name, null, null, null));
        });
    }

    public examples(): Promise<Feedstuff[]> {
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

}

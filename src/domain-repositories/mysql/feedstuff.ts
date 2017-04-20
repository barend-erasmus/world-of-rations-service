// Imports
import * as co from 'co';
import { Base } from './base';

// Imports repositories
import { IFeedstuffRepository } from './../feedstuff';

// Imports models
import { CompositionElement } from './../../domain-models/composition-element';
import { Feedstuff } from './../../domain-models/feedstuff';
import { FeedstuffElement } from './../../domain-models/feedstuff-element';
import { FeedstuffGroup } from './../../domain-models/feedstuff-group';
import { FormulationFeedstuff } from './../../domain-models/formulation-feedstuff';
import { SuggestedValue } from './../../domain-models/suggested-value';
import { SupplementElement } from './../../domain-models/supplement-element';
import { SupplementFeedstuff } from './../../domain-models/supplement-feedstuff';

export class FeedstuffRepository extends Base implements IFeedstuffRepository {

    constructor(config: any) {
        super(config);
    }

    public list(): Promise<Feedstuff[]> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL listFeedstuffs();`);

            const feedstuffs: Feedstuff[] = yield result.map((x) => self.loadElements(new Feedstuff(x.id, x.name, x.groupId === null ? null : new FeedstuffGroup(x.groupId, x.groupName), null, null)));
            return feedstuffs;
        });
    }

    public examples(): Promise<FormulationFeedstuff[]> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL listExampleFeedstuffs();`);

            const feedstuffs: Feedstuff[] = yield result.map((x) => self.loadElements(new FormulationFeedstuff(x.id, x.name, x.groupId === null ? null : new FeedstuffGroup(x.groupId, x.groupName), null, null, x.cost, x.minimum, x.maximum, null)));
            return feedstuffs;
        });
    }

    public create(feedstuff: Feedstuff): Promise<boolean> {
        const self = this;

        return co(function*() {
            if (feedstuff.isUserFeedstuff()) {
                const insertUserFeedstuffResult: any = yield self.query(`CALL insertUserFeedstuff('${feedstuff.id}', '${feedstuff.name}', '${feedstuff.group.id}');`);

                const insertUserFeedstuffElementResults: any[] = yield feedstuff.elements.map((x) => self.query(`CALL insertUserFeedstuffElement('${feedstuff.id}', '${x.id}', ${x.value})`));
            } else {
                const insertFeedstuffResult: any = yield self.query(`CALL insertFeedstuff('${feedstuff.id}', '${feedstuff.name}', '${feedstuff.group.id}');`);

                const insertFeedstuffElementResults: any[] = yield feedstuff.elements.map((x) => self.query(`CALL insertFeedstuffElement('${feedstuff.id}', '${x.id}', ${x.value})`));
            }

            return true;
        });
    }

    public update(feedstuff: Feedstuff): Promise<boolean> {
        const self = this;

        return co(function*() {
            if (feedstuff.isUserFeedstuff()) {
                const insertUserFeedstuffResult: any = yield self.query(`CALL updateUserFeedstuff('${feedstuff.id}', '${feedstuff.name}', '${feedstuff.group.id}');`);

                const insertUserFeedstuffElementResults: any[] = yield feedstuff.elements.map((x) => self.query(`CALL updateUserFeedstuffElement('${feedstuff.id}', '${x.id}', ${x.value})`));
            } else {
                const insertFeedstuffResult: any = yield self.query(`CALL updateFeedstuff('${feedstuff.id}', '${feedstuff.name}', '${feedstuff.group.id}');`);

                const insertFeedstuffElementResults: any[] = yield feedstuff.elements.map((x) => self.query(`CALL updateFeedstuffElement('${feedstuff.id}', '${x.id}', ${x.value})`));
            }

            return true;
        });
    }

    public findById(id: string): Promise<Feedstuff> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL findFeedstuffById('${id}');`);

            if (result.length === 0) {
                return null;
            }

            const group: FeedstuffGroup = result[0].groupId === null ? null : new FeedstuffGroup(result[0].groupId, result[0].groupName);

            let feedstuff: Feedstuff = new Feedstuff(result[0].id, result[0].name, group, null, result[0].username);

            feedstuff = yield self.loadElements(feedstuff);

            return feedstuff;
        });
    }

    public listByUsername(username): Promise<Feedstuff[]> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL listUserFeedstuffs('${username}');`);

            const feedstuffs: Feedstuff[] = yield result.map((x) => self.loadElements(new Feedstuff(x.id, x.name, x.groupId === null ? null : new FeedstuffGroup(x.groupId, x.groupName), null, username)));
            return feedstuffs;
        });
    }

    public findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId: string, feedstuffId: string): Promise<SuggestedValue> {
        const self = this;

        return co(function*() {
            const findSuggestedValuesByFormulaIdAndFeedstuffIdResult: any[] = yield self.query(`CALL findSuggestedValuesByFormulaIdAndFeedstuffId('${formulaId}','${feedstuffId}');`);

            if (findSuggestedValuesByFormulaIdAndFeedstuffIdResult.length === 0) {
                return null;
            } else {
                return new SuggestedValue(findSuggestedValuesByFormulaIdAndFeedstuffIdResult[0].minimum, findSuggestedValuesByFormulaIdAndFeedstuffIdResult[0].maximum);
            }
        });
    }

    public findSupplementFeedstuff(element: CompositionElement): Promise<SupplementElement> {
        const self = this;

        return co(function*() {
            const listSupplementFeedstuffByElementIdResult: any[] = yield self.query(`CALL listSupplementFeedstuffByElementId('${element.id}', ${element.sortageValue});`);

            const supplementElement = new SupplementElement(element.id, element.name, element.unit, element.sortOrder);

            supplementElement.supplementFeedstuffs = listSupplementFeedstuffByElementIdResult.map((x) => new SupplementFeedstuff(x.id, x.name, x.weight));
            supplementElement.selectedSupplementFeedstuff = supplementElement.supplementFeedstuffs.length === 0 ? null : supplementElement.supplementFeedstuffs[0];
            return supplementElement;
        });
    }

    private loadElements(feedstuff: Feedstuff) {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL listFeedstuffElementsById('${feedstuff.id}');`);

            feedstuff.elements = result.map((x) => new FeedstuffElement(x.id, x.name, x.unit, x.sortOrder, x.value));

            return feedstuff;
        });
    }

}

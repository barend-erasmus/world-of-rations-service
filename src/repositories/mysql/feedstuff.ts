// Imports
import * as co from 'co';
import * as util from 'util';
import { Base } from './base';

// Imports interfaces
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

export class FeedstuffRepository extends Base implements IFeedstuffRepository {

    constructor(config: any) {
        super(config);
    }

    // TODO: Move userFeedstuffs into a separate method on repository
    public listFeedstuffs(username: string): Promise<DomainFeedstuff[]> {
        const self = this;

        return co(function*() {
            const listFeedstuffsResult: DataFeedstuff[] = yield self.query(util.format('CALL listFeedstuffs(%s);', self.escapeAndFormat(username)));

            return listFeedstuffsResult.map((x) => new DomainFeedstuff(x.id, x.name, null, null, null));
        });
    }

    public listExampleFeedstuffs(): Promise<DomainFeedstuff[]> {
        const self = this;

        return co(function*() {
            const listExampleFeedstuffsResult: DataExampleFeedstuff[] = yield self.query('CALL listExampleFeedstuffs();');

            return listExampleFeedstuffsResult.map((x) => new DomainFeedstuff(x.id, x.name, x.minimum, x.maximum, x.cost));
        });
    }

    public findFeedstuffByFeedstuffId(feedstuffId: string): Promise<DomainFeedstuff> {
        const self = this;

        return co(function*() {
            const findFeedstuffByFeedstuffIdResult: DataFeedstuff[] = yield self.query(util.format('CALL findFeedstuffByFeedstuffId(%s, %s);', self.escapeAndFormat(feedstuffId), self.escapeAndFormat(null)));

            if (findFeedstuffByFeedstuffIdResult.length === 0) {
                return null;
            } else {
                return findFeedstuffByFeedstuffIdResult.map((x) => new DomainFeedstuff(x.id, x.name, null, null, null))[0];
            }
        });
    }

    public findUserFeedstuffByFeedstuffId(feedstuffId: string, username: string): Promise<DomainFeedstuff> {
        const self = this;

        return co(function*() {
            const findFeedstuffByFeedstuffIdResult: DataFeedstuff[] = yield self.query(util.format('CALL findFeedstuffByFeedstuffId(%s, %s);', self.escapeAndFormat(feedstuffId), self.escapeAndFormat(username)));

            if (findFeedstuffByFeedstuffIdResult.length === 0) {
                return null;
            } else {
                return findFeedstuffByFeedstuffIdResult.map((x) => new DomainFeedstuff(x.id, x.name, null, null, null))[0];
            }
        });
    }

    public findSuggestedValuesByFormulaIdAndFeedstuffId(formulaId: string, feedstuffId: string): Promise<DomainSuggestedValue> {
        const self = this;

        return co(function*() {
            const findSuggestedValuesByFormulaIdAndFeedstuffIdResult: DataSuggestedValue[] = yield self.query(util.format('CALL findSuggestedValuesByFormulaIdAndFeedstuffId(%s, %s);', self.escapeAndFormat(formulaId), self.escapeAndFormat(feedstuffId)));

            if (findSuggestedValuesByFormulaIdAndFeedstuffIdResult.length === 0) {
                return null;
            } else {
                return findSuggestedValuesByFormulaIdAndFeedstuffIdResult.map((x) => new DomainSuggestedValue(x.minimum, x.maximum))[0];
            }
        });
    }

    public listElementsByFeedstuffId(feedstuffId: string): Promise<DomainFeedstuffMeasurement[]> {
        const self = this;

        return co(function*() {
            const listElementsByFeedstuffIdResult: DataFeedstuffMeasurement[] = yield self.query(util.format('CALL listElementsByFeedstuffId(%s);', self.escapeAndFormat(feedstuffId)));

            return listElementsByFeedstuffIdResult.map((x) => new DomainFeedstuffMeasurement(x.id, x.name, x.value, x.unit, x.sortOrder));
        });
    }

    public listSupplementFeedstuffByElementId(element: DomainCompositionElement): Promise<DomainSupplementElement> {
        const self = this;

        return co(function*() {
            const listSupplementFeedstuffByElementIdResult: DataSupplementFeedstuff[] = yield self.query(util.format('CALL listSupplementFeedstuffByElementId(%s, %s);', self.escapeAndFormat(element.id), (element.minimum * 1000) - (element.value * 1000)));

            const supplementElement = new DomainSupplementElement(element.id, element.name, element.unit, element.sortOrder);

            supplementElement.supplementFeedstuffs = listSupplementFeedstuffByElementIdResult.map((x) => new DomainSupplementFeedstuff(x.id, x.name, x.weight));
            supplementElement.selectedSupplementFeedstuffs = supplementElement.supplementFeedstuffs.length === 0 ? [] : [supplementElement.supplementFeedstuffs[0]];
            return supplementElement;
        });
    }

    public listElementsByUserFeedstuffId(feedstuffId: string, username: string): Promise<DomainFeedstuffMeasurement[]> {
        const self = this;

        return co(function*() {
            const listElementsByUserFeedstuffIdResult: DataFeedstuffMeasurement[] = yield self.query(util.format('CALL listElementsByUserFeedstuffId(%s);', self.escapeAndFormat(feedstuffId)));

            return listElementsByUserFeedstuffIdResult.map((x) => new DomainFeedstuffMeasurement(x.id, x.name, x.value, x.unit, x.sortOrder));
        });
    }

    public listFeedstuffsByUsername(username: string): Promise<DomainFeedstuff[]> {
        const self = this;

        return co(function*() {
            const listFeedstuffsByUsernameResult: DataFeedstuff[] = yield self.query(util.format('CALL listFeedstuffsByUsername(%s);', self.escapeAndFormat(username)));
            return listFeedstuffsByUsernameResult.map((x) => new DomainFeedstuff(x.id, x.name, null, null, null));
        });
    }

    public insertUserFeedstuff(username: string, id: string, name: string, description: string): Promise<boolean> {
        const self = this;

        return co(function*() {
            const insertUserFeedstuffResult: any[] = yield self.query(util.format('CALL insertUserFeedstuff(%s, %s, %s, %s);', self.escapeAndFormat(username), self.escapeAndFormat(id), self.escapeAndFormat(name), self.escapeAndFormat(description)));
            return true;
        });
    }

    public insertUserFeedstuffMeasurement(feedstuffId: string, elementId: string, value: number, username: string): Promise<boolean> {
        const self = this;

        return co(function*() {
            const insertUserFeedstuffMeasurementResult: any[] = yield self.query(util.format('CALL insertUserFeedstuffMeasurement(%s, %s, %s);', self.escapeAndFormat(feedstuffId), self.escapeAndFormat(elementId), value));
            return true;
        });
    }

    public updateUserFeedstuffMeasurement(feedstuffId: string, elementId: string, value: number, username: string): Promise<boolean> {
        const self = this;

        return co(function*() {
            const updateUserFeedstuffMeasurementResult: any[] = yield self.query(util.format('CALL updateUserFeedstuffMeasurement(%s, %s, %s);', self.escapeAndFormat(feedstuffId), self.escapeAndFormat(elementId), value));
            return true;
        });
    }
}

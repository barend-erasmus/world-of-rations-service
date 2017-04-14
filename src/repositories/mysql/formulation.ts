// Imports
import * as util from 'util';
import { Base } from './base';

// Imports interfaces
import { IFormulationRepository } from './../formulation';

// Imports domain models
import { Feedstuff as DomainFeedstuff } from './../../models/feedstuff';
import { Formula as DomainFormula } from './../../models/formula';
import { Formulation as DomainFormulation } from './../../models/formulation';

// Imports data models
import { Formulation as DataFormulation } from './../../data-models/formulation';
import { FormulationFeedstuff as DataFormulationFeedstuff } from './../../data-models/formulation-feedstuff';

export class FormulationRepository extends Base implements IFormulationRepository {

    constructor(config: any) {
        super(config);
    }

    public insertFormulation(formulation: DomainFormulation, username: string): Promise<boolean> {

        const dataFormulation = formulation.toDataFormulation();
        const dataFormulationFeedstuffs = formulation.toDataFormulationFeedstuffs();

        const formulationP = this.query(util.format('CALL insertFormulation(%s, %s, %s, %s, %s, %s);',
            this.escapeAndFormat(formulation.id),
            this.escapeAndFormat(formulation.formula.id),
            formulation.feasible, formulation.cost,
            this.escapeAndFormat(formulation.currencyCode),
            new Date().getTime() / 1000));

        const formulationFeedstuffsP = dataFormulationFeedstuffs.map((x) => {
            return this.query(util.format('CALL insertFormulationFeedstuff(%s, %s, %s, %s, %s, %s);',
                this.escapeAndFormat(x.formulationId),
                this.escapeAndFormat(x.feedstuffId),
                x.minimum,
                x.maximum,
                x.cost,
                x.weight));
        });

        const p = formulationFeedstuffsP.concat([formulationP]);

        return Promise.all(p).then((result: any) => {
            return true;
        });
    }

    public findFormulationById(formulationId: string, username: string): Promise<DomainFormulation> {
        return this.query(util.format('CALL findFormulationById(%s);', this.escapeAndFormat(formulationId))).then((result: DataFormulation[]) => {

            const formulation = new DomainFormulation(result[0].id);
            formulation.formula = new DomainFormula(result[0].formulaId, null);
            formulation.cost = result[0].cost;
            formulation.feasible = result[0].feasible;
            formulation.currencyCode = result[0].currencyCode;

            return formulation;
        });
    }

    public listFormulationFeedstuffByFormulationId(formulationId: string, username: string): Promise<DomainFeedstuff[]> {
        return this.query(util.format('CALL listFormulationFeedstuffByFormulationId(%s);', this.escapeAndFormat(formulationId))).then((result: DataFormulationFeedstuff[]) => {
            return result.map((x) => {
                const feedstuff = new DomainFeedstuff(x.feedstuffId, x.name, x.minimum, x.maximum, x.cost);
                feedstuff.weight = x.weight;
                return feedstuff;
            });
        });
    }

    public listFormulations(username: string): Promise<DomainFormulation[]> {
        return this.query('CALL listFormulations();').then((result: DataFormulation[]) => {

            return result.map((x) => {
                const formulation = new DomainFormulation(result[0].id);
                formulation.id = result[0].id;
                formulation.formula = new DomainFormula(result[0].formulaId, result[0].name);
                formulation.cost = result[0].cost;
                formulation.feasible = result[0].feasible;
                formulation.currencyCode = result[0].currencyCode;

                return formulation;
            });
        });
    }
}

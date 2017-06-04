// Imports
import * as co from 'co';
import { Base } from './base';

// Imports repositories
import { IFeedstuffRepository } from './../feedstuff';
import { IFormulaRepository } from './../formula';
import { IFormulationRepository } from './../formulation';

// Imports models
import { CompositionElement } from './../../domain-models/composition-element';
import { Feedstuff } from './../../domain-models/feedstuff';
import { Formula } from './../../domain-models/formula';
import { Formulation } from './../../domain-models/formulation';
import { FormulationFeedstuff } from './../../domain-models/formulation-feedstuff';

export class FormulationRepository extends Base implements IFormulationRepository {

    constructor(config: any, private formulaRepository: IFormulaRepository, private feedstuffRepository: IFeedstuffRepository) {
        super(config);
    }

    public create(formulation: Formulation): Promise<boolean> {
        const self = this;

        return co(function*() {

            const insertFormulationResult: any = yield self.query(`CALL insertFormulation('${formulation.id}', '${formulation.formula.id}', ${formulation.feasible}, ${formulation.cost}, '${formulation.currencyCode}', ${formulation.timestamp});`, false);

            const insertFormulationFeedstuffResults: any[] = yield formulation.feedstuffs.map((x) => self.query(`CALL insertFormulationFeedstuff('${formulation.id}', '${x.id}', ${x.minimum}, ${x.maximum}, ${x.cost}, ${x.weight});`, false));

            return true;
        });
    }

    public findById(id: string): Promise<Formulation> {
        const self = this;

        return co(function*() {
            const findFormulationByIdResults: any[] = yield self.query(`CALL findFormulationById('${id}');`, true);

            if (findFormulationByIdResults.length === 0) {
                return null;
            }

            let formulation: Formulation = new Formulation(findFormulationByIdResults[0].id, findFormulationByIdResults[0].feasible, findFormulationByIdResults[0].cost, findFormulationByIdResults[0].currencyCode, new Formula(findFormulationByIdResults[0].formulaId, null, null, null, null), null, null, null, findFormulationByIdResults[0].username, findFormulationByIdResults[0].timestamp);

            formulation = yield self.loadFormulaAndComparisonFormula(formulation);

            formulation = yield self.loadFeedstuffs(formulation, true);

            formulation = yield self.loadSupplementElements(formulation);

            return formulation;
        });
    }

    public list(): Promise<Formulation[]> {
        const self = this;

        return co(function*() {
            const result: any[] = yield self.query(`CALL listFormulations();`, true);

            let formulations: Formulation[] = yield result.map((x) => new Formulation(x.id, x.feasible, x.cost, x.currencyCode, new Formula(x.formulaId, null, null, null, null), null, null, null, x.username, x.timestamp));

            formulations = yield formulations.map((x) => self.loadFormulaAndComparisonFormula(x));

            formulations = yield formulations.map((x) => self.loadFeedstuffs(x, true));

            formulations = yield formulations.map((x) => self.loadSupplementElements(x));

            return formulations;
        });
    }

    private loadSupplementElements(formulation: Formulation): Promise<Formulation> {
        const self = this;

        return co(function*() {
            const supplementElements: any[] = yield formulation.getCompositionElementForSupplementElements().map((x) => self.feedstuffRepository.findSupplementFeedstuff(x));

            formulation.supplementElements = supplementElements;

            return formulation;
        });
    }

    private loadFormulaAndComparisonFormula(formulation: Formulation): Promise<Formulation> {
        const self = this;

        return co(function*() {
            formulation.formula = yield self.formulaRepository.findById(formulation.formula.id);
            formulation.comparisonFormula = yield self.formulaRepository.findById(formulation.formula.comparisonFormulaId);

            return formulation;
        });
    }

    private loadFeedstuffs(formulation: Formulation, useCache: boolean): Promise<Formulation> {
        const self = this;

        return co(function*() {
            const listFormulationFeedstuffsByIdResults: any[] = yield self.query(`CALL listFormulationFeedstuffsById('${formulation.id}');`, useCache);

            const feedstuffs: Feedstuff[] = yield listFormulationFeedstuffsByIdResults.map((x) => self.feedstuffRepository.findById(x.id));

            formulation.feedstuffs = feedstuffs.map((x, i) => {
                const f: any = listFormulationFeedstuffsByIdResults[i];

                return new FormulationFeedstuff(x.id, x.name, x.group, x.elements, x.username, f.cost, f.minimum, f.maximum, f.weight);
            });

            return formulation;
        });
    }
}

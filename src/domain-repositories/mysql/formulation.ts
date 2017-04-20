// Imports
import * as co from 'co';
import { Base } from './base';

// Imports repositories
import { IFeedstuffRepository } from './../feedstuff';
import { IFormulaRepository } from './../formula';
import { IFormulationRepository } from './../formulation';

// Imports models
import { Feedstuff } from './../../domain-models/feedstuff';
import { Formulation } from './../../domain-models/formulation';
import { FormulationFeedstuff } from './../../domain-models/formulation-feedstuff';
import { CompositionElement } from './../../domain-models/composition-element';

export class FormulationRepository extends Base implements IFormulationRepository {

    constructor(config: any, private formulaRepository: IFormulaRepository, private feedstuffRepository: IFeedstuffRepository) {
        super(config);
    }

    public create(formulation: Formulation): Promise<boolean> {
        const self = this;

        return co(function* () {

            const insertFormulationResult: any = yield self.query(`CALL insertFormulation('${formulation.id}', '${formulation.formula.id}', ${formulation.feasible}, ${formulation.cost}, '${formulation.currencyCode}', ${formulation.timestamp});`);

            const insertFormulationFeedstuffResults: any[] = yield formulation.feedstuffs.map((x) => self.query(`CALL insertFormulationFeedstuff('${formulation.id}', '${x.id}', ${x.minimum}, ${x.maximum}, ${x.cost}, ${x.weight});`));

            return true;
        });
    }

    public findById(id: string): Promise<Formulation> {
        const self = this;

        return co(function* () {
            const findFormulationByIdResults: any[] = yield self.query(`CALL findFormulationById('${id}');`);

            if (findFormulationByIdResults.length === 0) {
                return null;
            }

            const formulation: Formulation = new Formulation(findFormulationByIdResults[0].id, findFormulationByIdResults[0].feasible, findFormulationByIdResults[0].cost, findFormulationByIdResults[0].currencyCode, null, null, null, null, findFormulationByIdResults[0].username, findFormulationByIdResults[0].timestamp);

            formulation.formula = yield self.formulaRepository.findById(findFormulationByIdResults[0].formulaId);
            formulation.comparisonFormula = yield self.formulaRepository.findById(formulation.formula.comparisonFormulaId);

            const listFormulationFeedstuffsByIdResults: any[] = yield self.query(`CALL listFormulationFeedstuffsById('${id}');`);

            const feedstuffs: Feedstuff[] = yield listFormulationFeedstuffsByIdResults.map((x) => self.feedstuffRepository.findById(x.id));

            formulation.feedstuffs = feedstuffs.map((x, i) => {
                const f: any = listFormulationFeedstuffsByIdResults[i];

                return new FormulationFeedstuff(x.id, x.name, x.group, x.elements, x.username, f.cost, f.minimum, f.maximum, f.weight);
            });

            const supplementElements = yield formulation.GetCompositionElementForSupplementElements().map((x) => self.feedstuffRepository.findSupplementFeedstuff(x));

            formulation.supplementElements = supplementElements;

            return formulation;
        });
    }

    public list(): Promise<Formulation[]> {
        return Promise.resolve([]);
    }
}

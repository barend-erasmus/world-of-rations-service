// Imports view models
import { FormulationResult as ViewModelFormulationResult } from './../view-models/formulation-result';

export class FormulationResult {
    constructor(public id: string, public feasible: boolean, public currencyCode: string, public cost: number) {

    }

    public toViewModelFormulationResult(): ViewModelFormulationResult {
        return new ViewModelFormulationResult(this.id, this.feasible, this.currencyCode, this.cost);
    }
}

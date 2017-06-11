// Imports view models
import { FormulationResult as ViewModelFormulationResult } from './../view-models/formulation-result';

export class FormulationResult {
    constructor(public id: string, public feasible: boolean, public currencyCode: string, public cost: number) {

    }

    public isValid(): boolean {

        if (!this.id) {
            return false;
        }   

        if (!this.currencyCode) {
            return false
        }

        return true;
    }

    public toViewModelFormulationResult(): ViewModelFormulationResult {
        return new ViewModelFormulationResult(this.id, this.feasible, this.currencyCode, this.cost);
    }
}

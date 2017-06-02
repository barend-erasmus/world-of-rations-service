// Imports view models
import { SuggestedValue as ViewModelSuggestedValue } from './../view-models/suggested-value';

export class SuggestedValue {
    constructor(public minimum: number, public maximum: number) {
    }

    public toViewModelSuggestedValue(): ViewModelSuggestedValue {
        return new ViewModelSuggestedValue(this.minimum, this.maximum);
    }
}

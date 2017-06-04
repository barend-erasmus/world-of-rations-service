// Imports models
import { Element } from './element';

// Imports view models
import { CompositionElement as ViewModelCompositionElement} from './../view-models/composition-element';

export class CompositionElement extends Element {
    constructor(
        id: string,
        name: string,
        unit: string,
        sortOrder: number,
        public value: number,
        public status: string,
        public sortageValue: number,
    ) {
        super(id, name, unit, null, sortOrder);
    }

    public hasSortage() {
        return this.status === 'Inadequate';
    }

    public isValid() : boolean {
        if (!this.id) {
            return false;
        }

        if (!this.name) {
            return false;
        } 

        if (!this.unit) {
            return false;
        }

        if (!this.sortOrder) {
            return false;
        }

        if (!this.status) {
            return false;
        }

        return true;
    }   

    public toViewModelCompositionElement(): ViewModelCompositionElement {
        return new ViewModelCompositionElement(this.id, this.name, this.unit, this.sortOrder, this.value, this.status, this.sortageValue);
    }
}

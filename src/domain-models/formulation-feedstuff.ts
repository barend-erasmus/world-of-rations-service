// Imports models
import { Feedstuff } from './feedstuff';
import { FeedstuffElement } from './feedstuff-element';
import { FeedstuffGroup } from './feedstuff-group';

// Imports view models
import { FormulationFeedstuff as ViewModelFormulationFeedstuff } from './../view-models/formulation-feedstuff' 

export class FormulationFeedstuff extends Feedstuff {

    public static mapFormulationFeedstuff(obj: FormulationFeedstuff) {
        const feedstuff = Feedstuff.mapFeedstuff(obj);
        return new FormulationFeedstuff(feedstuff.id, feedstuff.name, feedstuff.group, feedstuff.elements, feedstuff.username, obj.cost, obj.minimum, obj.maximum, obj.weight);
    }

    constructor(
        id: string,
        name: string,
        group: FeedstuffGroup,
        elements: FeedstuffElement[],
        username: string,
        public cost: number,
        public minimum: number,
        public maximum: number,
        public weight: number,
    ) {
        super(id, name, group, elements, username);
    }

    public isValid(): boolean {

        if (!this.id) {
            return false;
        }

        if (!this.name) {
            return false;
        }

        if (!this.elements) {
            return false;
        }

        if (this.elements.filter((x) => !x.isValid()).length > 0) {
            return false;
        }
        
        return true;
    }

    public toViewModelFormulationFeedstuff(): ViewModelFormulationFeedstuff {
        return new ViewModelFormulationFeedstuff(this.id, this.name, this.group.toViewModelFeedstuffGroup(), this.elements.map((x) => x.toViewModelFeedstuffElement()), this.username, this.cost, this.minimum, this.maximum, this.weight);
    }
}

import { Player } from "../../../schema/mobiles/player";
import { BaseTileComponent } from "../../../schema/tilemap/tile/components/baseTileComponent";

export class AnimalsComponent extends BaseTileComponent {
    constructor(name: string, energyCost: number) {
        super(name, true, energyCost);
    }

    effect(mobile: any) {

    }

    interact(mobile: Player): boolean {
        if (mobile.energy >= this.energyCost) {
            mobile.energy -= this.energyCost;
            return true;
        }
        return false;
    }
}
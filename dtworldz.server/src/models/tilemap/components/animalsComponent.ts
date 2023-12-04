import { Player } from "../../../schema/mobiles/player";
import { BaseTileComponent } from "../../../schema/tilemap/tile/components/baseTileComponent";

export class AnimalsComponent extends BaseTileComponent {
    hungerGain: number;
    constructor(name: string, energyCost: number, hungerGain: number = 1) {
        super(name, true, energyCost);
        this.hungerGain = hungerGain;
    }

    effect(mobile: any) {

    }

    interact(mobile: Player): boolean {
        if (mobile.energy >= this.energyCost) {
            mobile.energy -= this.energyCost;

            mobile.hunger += this.hungerGain;
            return true;
        }
        return false;
    }
}
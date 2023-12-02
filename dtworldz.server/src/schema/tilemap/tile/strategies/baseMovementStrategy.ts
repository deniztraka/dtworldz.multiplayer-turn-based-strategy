import { Schema } from "@colyseus/schema";
import { BaseMobile } from "../../../mobiles/baseMobile";
import { BaseTile } from "../baseTile";
import { Attributes } from "../../../../engines/attributeSystem/attributes";
import { Player } from "../../../mobiles/player";

export abstract class BaseMovementStrategy {

    energyCost: number;
    constructor(energyCost: number) {
        this.energyCost = energyCost;
    }

    canMove(mobile: any) {
        if (mobile.energy > 0 && mobile.energy >= this.energyCost) {
            return true;
        }
        return false;
    }

    move(mobile: BaseMobile, tile: BaseTile) {
        if (!this.canMove(mobile)) {
            return new Error("Cannot move");
        }

        if(mobile instanceof Player){
            let player = mobile as Player;
            player.energy -= this.energyCost;
        }

        // let newVal = mobile.attributes.get(Attributes.Energy) - this.energyCost;
        // mobile.attributes.set(Attributes.Energy, newVal);
        mobile.position = tile.position;
    }
}
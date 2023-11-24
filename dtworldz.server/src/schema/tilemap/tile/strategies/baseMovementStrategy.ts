import { Schema } from "@colyseus/schema";
import { BaseMobile } from "../../../mobiles/baseMobile";
import { BaseTile } from "../baseTile";
import { Attributes } from "../../../../engines/attributeSystem/attributes";

export abstract class BaseMovementStrategy {

    energyCost: number;
    constructor(energyCost: number) {
        this.energyCost = energyCost;
    }

    canMove(mobile: any) {
        if (mobile.energy > 0 && mobile.energy < this.energyCost) {
            return false;
        }

        return true;
    }

    move(mobile: BaseMobile, tile: BaseTile) {
        if (!this.canMove(mobile)) {
            return new Error("Cannot move");
        }

        let newVal = mobile.attributes.get(Attributes.Energy) - this.energyCost;
        mobile.attributes.set(Attributes.Energy, newVal);
        mobile.position = tile.position;
    }
}
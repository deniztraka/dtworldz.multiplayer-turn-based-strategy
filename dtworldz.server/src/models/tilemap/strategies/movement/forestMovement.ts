import { Trait } from "../../../../engines/traitSystem/traits";
import { TraitsEngine } from "../../../../engines/traitSystem/traitsEngine";
import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class ForestMovementStrategy extends BaseMovementStrategy {
    constructor() {
        super(8);
    }

    canMove(mobile: any): boolean {
        let canMove = super.canMove(mobile);
        if(canMove && TraitsEngine.checkRequirements(Trait.Pathfinding, mobile)){
            return true;
        }

        return false;
    }
}
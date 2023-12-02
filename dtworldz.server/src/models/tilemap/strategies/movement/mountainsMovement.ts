import { Trait } from "../../../../engines/traitSystem/traits";
import { TraitsEngine } from "../../../../engines/traitSystem/traitsEngine";
import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class MountainsMovement extends BaseMovementStrategy {
    constructor() {
        super(13);
    }
    canMove(mobile: any) {
        let canMove = super.canMove(mobile);
        if(canMove && TraitsEngine.checkRequirements(Trait.Climbing, mobile)){
            return true;
        }

        return false;
    }
}
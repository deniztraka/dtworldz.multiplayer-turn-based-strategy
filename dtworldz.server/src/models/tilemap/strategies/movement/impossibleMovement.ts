import { BaseMobile } from "../../../../schema/mobiles/baseMobile";
import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class WaterMovement extends BaseMovementStrategy {
    canMove(mobile: BaseMobile) {
        return false;
    }
}
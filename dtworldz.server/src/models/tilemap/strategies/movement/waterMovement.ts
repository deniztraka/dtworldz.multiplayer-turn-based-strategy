import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class WaterMovement extends BaseMovementStrategy {
    canMove(mobile: any) {
        return true; // Standard movement, applicable to most tiles
    }
}
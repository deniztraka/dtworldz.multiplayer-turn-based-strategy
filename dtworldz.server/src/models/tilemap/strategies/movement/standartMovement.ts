import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class StandardMovement extends BaseMovementStrategy {
    canMove(mobile: any) {
        return true; // Standard movement, applicable to most tiles
    }
}
import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class MountainsMovement extends BaseMovementStrategy {
    canMove(mobile: any) {
        return true; // Standard movement, applicable to most tiles
    }
}
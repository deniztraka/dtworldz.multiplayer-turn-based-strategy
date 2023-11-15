import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class ImpossibleMovement extends BaseMovementStrategy {
    canMove(mobile: any) {
        return false; // Impossible to move for any character
    }
}
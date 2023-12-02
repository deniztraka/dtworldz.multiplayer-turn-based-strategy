import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class StandardMovement extends BaseMovementStrategy {
    constructor() {
        super(1);
    }
}
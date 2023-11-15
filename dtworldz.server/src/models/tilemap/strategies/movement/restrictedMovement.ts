import { BaseMovementStrategy } from "../../../../schema/tilemap/tile/strategies/baseMovementStrategy";

export class RestrictedMovement extends BaseMovementStrategy {
    canMove(mobile:any) {
        // Logic for restricted movement (e.g., Mountains, Seas)
        return mobile.type !== 'Restricted'; // Example condition
    }
}
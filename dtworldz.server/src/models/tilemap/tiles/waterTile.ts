import { BaseTile } from "../../../schema/tilemap/tile/baseTile";
import { StandardMovement } from "../strategies/movement/standartMovement";

export class WaterTile extends BaseTile {
    constructor() {
        super(0, 'Water', new StandardMovement());
    }
}
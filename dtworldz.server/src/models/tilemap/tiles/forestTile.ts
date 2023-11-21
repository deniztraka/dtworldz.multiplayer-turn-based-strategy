import { BaseTile } from "../../../schema/tilemap/tile/baseTile";
import { StandardMovement } from "../strategies/movement/standartMovement";

export class ForestTile extends BaseTile {
    constructor() {
        super(2, 'Plains', new StandardMovement());
    }
}
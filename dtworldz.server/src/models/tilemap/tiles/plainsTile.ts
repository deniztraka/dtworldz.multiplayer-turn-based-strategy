import { BaseTile } from "../../../schema/tilemap/tile/baseTile";
import { StandardMovement } from "../strategies/movement/standartMovement";

export class PlainsTile extends BaseTile {
    constructor() {
        super(1, 'Plains', new StandardMovement());
    }
}
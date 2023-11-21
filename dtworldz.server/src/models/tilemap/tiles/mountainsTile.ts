import { BaseTile } from "../../../schema/tilemap/tile/baseTile";
import { StandardMovement } from "../strategies/movement/standartMovement";

export class MountainsTile extends BaseTile {
    constructor() {
        super(3, 'Plains', new StandardMovement());
    }
}
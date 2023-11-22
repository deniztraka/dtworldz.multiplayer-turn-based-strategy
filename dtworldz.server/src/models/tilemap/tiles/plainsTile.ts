import { BaseTile } from "../../../schema/tilemap/tile/baseTile";
import { StandardMovement } from "../strategies/movement/standartMovement";
import { Biomes } from "./Biomes";

export class PlainsTile extends BaseTile {
    constructor() {
        super(1, Biomes.Plains, new StandardMovement());
    }
}
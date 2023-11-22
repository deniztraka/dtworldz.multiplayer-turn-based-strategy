import { Position } from "../../../schema/position";
import { BaseTile } from "../../../schema/tilemap/tile/baseTile";
import { StandardMovement } from "../strategies/movement/standartMovement";
import { Biomes } from "./Biomes";

export class PlainsTile extends BaseTile {
    constructor(pos: Position) {
        super(1, pos, Biomes.Plains,  new StandardMovement(2));
    }
}
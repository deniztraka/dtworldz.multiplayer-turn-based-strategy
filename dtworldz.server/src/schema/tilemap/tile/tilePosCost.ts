import { Position } from "../../position";

import { Schema, type } from "@colyseus/schema";

export class TilePosCost extends Schema {
    @type(Position) position: Position | undefined;
    @type("number") cost: number;
    constructor(position: Position | undefined, cost: number) {
        super();
        this.position = position;
        this.cost = cost;
    }
}
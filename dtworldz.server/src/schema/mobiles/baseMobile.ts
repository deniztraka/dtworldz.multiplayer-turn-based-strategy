import { Schema, type } from "@colyseus/schema";
import { Position } from "../position";

export class BaseMobile extends Schema {
    @type("string") name: string = "";
    @type(Position) position: Position | undefined;

    constructor(position: Position | undefined) {
        super();
        this.position = position;
    }
}
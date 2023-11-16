import { Schema, type } from "@colyseus/schema";
import { Position } from "../position";

export class BaseMobile extends Schema {
    @type("string") name: string = "";
    @type("boolean") isReady: boolean = false;
    @type(Position) position: Position | undefined;

    constructor(name:string, position: Position | undefined) {
        super();
        this.name = name;
        this.position = position;
    }
}
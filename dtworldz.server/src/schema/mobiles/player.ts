import { type } from "@colyseus/schema";
import { Position } from "../position";
import { BaseMobile } from "./baseMobile";

export class Player extends BaseMobile {
    @type("number") charIndex: number = Math.floor(Math.random() * 4);
    constructor(name:string, position: Position | undefined) {
        super(name, position);
    }
}
import { Position } from "../position";
import { BaseMobile } from "./baseMobile";

export class Player extends BaseMobile {
    constructor(name:string, position: Position | undefined) {
        super(name, position);
    }
}
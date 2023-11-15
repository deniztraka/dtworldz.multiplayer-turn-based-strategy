import { Position } from "../position";
import { BaseMobile } from "./baseMobile";

export class Player extends BaseMobile {
    constructor(position: Position | undefined) {
        super(position);
    }
}
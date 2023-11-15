import { Position } from "../position";
import { BaseMobile } from "./baseMobile";

export class Player extends BaseMobile {
    isReady: any;
    constructor(position: Position | undefined) {
        super(position);
    }
}
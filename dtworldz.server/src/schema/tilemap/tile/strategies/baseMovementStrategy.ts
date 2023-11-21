import { Schema } from "@colyseus/schema";
import { BaseMobile } from "../../../mobiles/baseMobile";

export abstract class BaseMovementStrategy {
    abstract canMove(mobile:BaseMobile):void;
}
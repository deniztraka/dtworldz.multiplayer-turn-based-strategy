import { Schema } from "@colyseus/schema";

export abstract class BaseMovementStrategy extends Schema {
    abstract canMove(mobile:any):void;
}
import { Schema, type } from "@colyseus/schema";

export abstract class BaseTileComponent extends Schema {
    @type("string") name: string;
    @type("number") isInteractable: boolean;
    constructor(name:string, isInteractable: boolean) {
        super();
        this.name = name;
        this.isInteractable = isInteractable;
    }

    abstract effect(mobile:any) : void;

    abstract interact(mobile:any) : void;
}
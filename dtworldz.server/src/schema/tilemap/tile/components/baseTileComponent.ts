import { Schema, type } from "@colyseus/schema";

export abstract class BaseTileComponent extends Schema {
    @type("string") name: string;
    @type("boolean") isInteractable: boolean;
    @type("number") energyCost: number;
    constructor(name:string, isInteractable: boolean, energyCost: number) {
        super();
        this.energyCost = energyCost;
        this.name = name;
        this.isInteractable = isInteractable;
    }

    abstract effect(mobile:any) : void;

    abstract interact(mobile:any) : boolean;
}
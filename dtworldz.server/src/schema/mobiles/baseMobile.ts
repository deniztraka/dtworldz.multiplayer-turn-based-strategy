import { Schema, type, ArraySchema, filter } from "@colyseus/schema";
import { Position } from "../position";
import { Trait } from "../../engines/traitSystem/traits";
import { TraitsEngine } from "../../engines/traitSystem/traitsEngine";
import { Attributes } from "../../engines/attributeSystem/attributes";
import { BaseTile } from "../tilemap/tile/baseTile";
import { Client } from '@colyseus/core';
import { TilePosCost } from "../tilemap/tile/tilePosCost";

export class BaseMobile extends Schema {
    @type("string") sessionId: string;
    @type("string") name: string = "";
    @type("boolean") isReady: boolean = false;
    @type(Position) position: Position | undefined;
    @type([TilePosCost]) currentPath: ArraySchema<TilePosCost>;
    private traits: Map<Trait, any> = new Map();
    attributes: Map<Attributes, number> = new Map();
    @type("boolean") isMoving: boolean = false;

    constructor(name: string, position: Position | undefined) {
        super();
        this.currentPath = new ArraySchema<TilePosCost>();
        this.name = name;
        this.position = position;
        this.position =  position || new Position(0, 0);
    }

    isMovingNow(): boolean {
        return this.isMoving;
    }

    setMovingNow(isMoving: boolean) {
        this.isMoving = isMoving;
    }

    setAttribute(attribute: Attributes, value: number) {
        this.attributes.set(attribute, value);
    }

    getAttribute(attribute: Attributes) {
        return this.attributes.get(attribute);
    }

    addTrait(trait: Trait, data?: any) {
        if (TraitsEngine.checkRequirements(trait, this)) {
            this.traits.set(trait, data);
        } else {
            throw new Error("Trait requirements not met");
        }
    }

    getTraitData(trait: Trait): any {
        return this.traits.get(trait);
    }

    hasTrait(trait: Trait): boolean {
        return this.traits.has(trait);
    }

    removeTrait(trait: Trait) {
        this.traits.delete(trait);
    }

    tryMove(tile: BaseTile): boolean {
        return tile.tryMove(this);
    }
}
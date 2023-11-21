import { Schema, type } from "@colyseus/schema";
import { Position } from "../position";
import { Trait } from "../../engines/traitSystem/traits";
import { TraitsEngine } from "../../engines/traitSystem/traitsEngine";
import { Attributes } from "../../engines/attributeSystem/attributes";

export class BaseMobile extends Schema {
    @type("string") name: string = "";
    @type("boolean") isReady: boolean = false;
    @type("number") speed: number = 1;
    @type(Position) position: Position | undefined;
    private traits: Map<Trait, any> = new Map();
    currentPath: any[];
    attributes: Map<Attributes, number>  = new Map();

    constructor(name:string, position: Position | undefined) {
        super();
        this.currentPath = [];
        this.name = name;
        this.position = position;
        this.speed = 1;
        this.attributes.set(Attributes.Strength, 10);
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
}
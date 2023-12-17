import { Schema, type, MapSchema } from "@colyseus/schema";
import { BaseTileComponent } from "./components/baseTileComponent";
import { BaseMovementStrategy } from "./strategies/baseMovementStrategy";
import { Natures } from "../../../models/tilemap/tiles/Natures";
import { Position } from "../../position";

export class BaseTile extends Schema {
    @type("string") name: string;
    @type("number") id: number;
    @type("number") biome: number; // plains, snow, desert, swamp, lava
    @type("number") nature: Natures; // forest, mountains, hills, lake, river
    @type("string") natureDisplayName: string; // forest, mountains, hills, lake, river
    @type(Position) position: Position;
    @type({ map: BaseTileComponent }) components = new MapSchema<BaseTileComponent>();
    movementStrategy: BaseMovementStrategy;

    constructor(name: string, id: number, position: Position, biome: number, movementStrategy: BaseMovementStrategy) {
        super();
        this.name = name;
        this.id = id;
        this.biome = biome;
        this.movementStrategy = movementStrategy;
        this.nature = Natures.None;
        this.position = position;
    }

    setNature(nature: Natures) {
        if (this.nature === Natures.None) {
            this.nature = nature;
        } else {
            throw new Error('Tile already has nature. Cannot set nature twice.');
        }

        switch (nature) {
            case Natures.Forest:
                this.natureDisplayName = 'Forest';
                break;
            case Natures.Mountain:
                this.natureDisplayName = 'Mountain';
                break;
            case Natures.Lake:
                this.natureDisplayName = 'Lake';
                break;
            case Natures.River:
                this.natureDisplayName = 'River';
                break;
            // case Natures.None:
            //     this.natureDisplayName = '';
                break;
            default:
                this.natureDisplayName = '';
                break;
        }
    }

    addComponent(component: BaseTileComponent) {
        this.components.set(component.name, component);
    }

    removeComponent(componentName: string) {
        this.components.delete(componentName);
    }

    applyEffects(mobile: any) {
        this.components.forEach((component) => {
            component.effect(mobile);
        });
    }

    interact(mobile: any, componentId: string) {
        let component = this.components.get(componentId);
        if (component) {
            component.interact(mobile);
        }
    }

    getInteractableComponents(): BaseTileComponent[] {
        let interactableComponents: BaseTileComponent[] = [];
        this.components.forEach((component) => {
            if (component.isInteractable) {
                interactableComponents.push(component);
            }
        });
        return interactableComponents;
    }

    setMovementStrategy(movementStrategy: BaseMovementStrategy) {
        this.movementStrategy = movementStrategy;
    }

    canMove(mobile: any) {
        return this.movementStrategy.canMove(mobile);
    }

    tryMove(mobile: any) {
        if (this.movementStrategy.canMove(mobile)) {
            this.movementStrategy.move(mobile, this);
            return true;
        }

        return false;
    }

    getMovementCost(mobile: any) {
        return this.movementStrategy.energyCost;
    }
}


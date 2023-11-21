import { Schema, type, MapSchema } from "@colyseus/schema";
import { BaseTileComponent } from "./components/baseTileComponent";
import { BaseMovementStrategy } from "./strategies/baseMovementStrategy";

export class BaseTile extends Schema {
    @type("number") id: number;
    @type("string") type: string;
    @type({ map: BaseTileComponent }) components = new MapSchema<BaseTileComponent>();
    movementStrategy: BaseMovementStrategy;

    constructor(id:number, type: string, movementStrategy: BaseMovementStrategy) {
      super();
      this.id = id;
      this.type = type;
      this.movementStrategy = movementStrategy;
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
       if(component) {
           component.interact(mobile);
       }
    }

    getInteractableComponents() : BaseTileComponent[] {
        let interactableComponents: BaseTileComponent[] = [];
        this.components.forEach((component) => {
            if(component.isInteractable) {
                interactableComponents.push(component);
            }
        });
        return interactableComponents;
    }
  }


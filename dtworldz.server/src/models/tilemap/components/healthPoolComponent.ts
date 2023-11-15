import { BaseTileComponent } from "../../../schema/tilemap/tile/components/baseTileComponent";

export class HealthPoolComponent extends BaseTileComponent {
    constructor() {
        super('HealthPool', false);
    }

    effect(mobile:any) {
        console.log("Health pool increases player's health");
        // Implement defense increase
    }

    interact(mobile:any) {

        // Implement interaction specifics
    }
}
import { BaseTileComponent } from "../../../schema/tilemap/tile/components/baseTileComponent";

export class EnergyPoolComponent extends BaseTileComponent {
    constructor() {
        super('EnergyPool', false);
    }

    effect(mobile:any) {
        console.log("Energy pool increases player's energy");
        // Implement energy increase
    }

    interact(mobile:any): boolean {
        return true;
        // Implement interaction specifics
    }
}
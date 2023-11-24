import { BaseTileComponent } from "../../../schema/tilemap/tile/components/baseTileComponent";

export class CastleComponent extends BaseTileComponent {
    constructor() {
        super('Castle', true);
    }

    effect(mobile:any) {
        console.log("Castle increases player's defense");
        // Implement defense increase
    }

    interact(mobile:any) {
        console.log("Player interacts with the Castle");
        // Implement interaction specifics
        return true;
    }
}
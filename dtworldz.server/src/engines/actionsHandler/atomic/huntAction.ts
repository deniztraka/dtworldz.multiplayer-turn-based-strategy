import { WorldRoom } from "../../../rooms/dtWorldz";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { BaseTile } from "../../../schema/tilemap/tile/baseTile";
import { BaseTileComponent } from "../../../schema/tilemap/tile/components/baseTileComponent";
import { TilePosCost } from "../../../schema/tilemap/tile/tilePosCost";
import { AtomicAction } from "./atomicAction";
import { ArraySchema } from "@colyseus/schema";

export class HuntAction extends AtomicAction {
    constructor(mobile: BaseMobile, payload: { position: { x: number, y: number }, component: string }) {
        super(mobile, payload);
    }

    execute(worldRoom: WorldRoom): void {
        if (this.mobile instanceof Player) {
            const targetTile = worldRoom.state.getTile(this.payload.position.x, this.payload.position.y);
            if (targetTile) {
                const targetTileComponents = targetTile.getInteractableComponents();
                const targetComponent = targetTileComponents.find((c: any) => c.name === this.payload.component) as BaseTileComponent;
                if (targetComponent) {
                    const player = this.mobile as Player;
                    const huntResult = targetComponent.interact(player);
                    if(huntResult){
                        // Remove the component from the tile
                        targetTile.removeComponent(targetComponent.name);
                    }

                    // Send the hunt result to the client
                    player.client.send('ca_action_result',
                        {
                            aid: 'hunt',
                            sessionId: player.client.sessionId,
                            payload: {
                                result: huntResult,
                                targetComponent: targetComponent.name,
                                targetPosition: { x: targetTile.position.x, y: targetTile.position.y },
                                message: huntResult ? 'This was a good hunt.' : "Can't hunt here"
                            }
                        });
                }
            }
        }
    }
}
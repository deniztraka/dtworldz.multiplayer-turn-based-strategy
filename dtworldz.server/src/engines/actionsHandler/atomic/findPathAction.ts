import { WorldRoom } from "../../../rooms/dtWorldz";
import { ArraySchema } from "@colyseus/schema";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { Position } from "../../../schema/position";
import { AtomicAction } from "./atomicAction";
import { TilePosCost } from "../../../schema/tilemap/tile/tilePosCost";

export class FindPathAction extends AtomicAction {
    constructor(mobile: BaseMobile, payload: any) {
        super(mobile, payload);
    }

    execute(worldRoom: WorldRoom): void {
        if (this.mobile instanceof Player && !this.mobile.isMovingNow()) {

            // Access pathfinding service from worldRoom
            const pathfindingService = worldRoom.getPathfindingService(this.mobile);
 
            // Assuming actionPayload contains the destination
            const destination = this.payload;

            pathfindingService.findPathForPlayer(this.mobile.position, destination, this.mobile)
                .then(path => {

                    let positions = new ArraySchema<TilePosCost>();
                    for (let index = 0; index < path.length; index++) {
                        const pos = path[index];
                        positions.push(new TilePosCost(pos, worldRoom.state.getTile(pos.x, pos.y).movementStrategy.energyCost));
                    }
                    this.mobile.currentPath = positions;
                    const client = worldRoom.getClient(this.mobile.sessionId);
                    const tile = worldRoom.state.getTile(destination.x, destination.y);
                    if(tile){
                        worldRoom.send(client, 'sa_tile-props', { tile: tile });
                    }
                })
                .catch(error => {

                    console.log(error.message)
                    // Handle errors
                });
        }
    }
}
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

            //console.log(`FindPathAction: ${this.mobile.sessionId} is trying to find path to ${destination.x}, ${destination.y}`)

            pathfindingService.findPathForPlayer(this.mobile.position, destination, this.mobile)
                .then(path => {
                    this.mobile.currentPath = new ArraySchema<TilePosCost>;
                    const client = worldRoom.getClient(this.mobile.sessionId);
                    const tile = worldRoom.state.getTile(destination.x, destination.y);

                    if (path.length === 0 && this.mobile.position.x === destination.x && this.mobile.position.y === destination.y) {
                        //console.log(`FindPathAction: ${this.mobile.sessionId} is trying to find path to ${destination.x}, ${destination.y} but it's already there`)
                        client.send('sa_tile-props', tile);
                        
                        return;
                    }

                    let positions = new ArraySchema<TilePosCost>();
                    for (let index = 0; index < path.length; index++) {
                        const pos = path[index];
                        positions.push(new TilePosCost(pos, worldRoom.state.getTile(pos.x, pos.y).movementStrategy.energyCost));
                    }
                    this.mobile.currentPath = positions;

                    if(tile){
                        client.send('sa_tile-props', tile);
                    }
                })
                .catch(error => {

                    console.log(error.message)
                    // Handle errors
                });
        }
    }
}
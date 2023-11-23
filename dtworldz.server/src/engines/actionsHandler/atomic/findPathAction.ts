import { WorldRoom } from "../../../rooms/dtWorldz";
import { ArraySchema } from "@colyseus/schema";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { Position } from "../../../schema/position";
import { AtomicAction } from "./atomicAction";

export class FindPathAction extends AtomicAction {
    constructor(mobile: BaseMobile, payload: any) {
        super(mobile, payload);
    }

    execute(worldRoom: WorldRoom): void {
        if (this.mobile instanceof Player) {
            // Access pathfinding service from worldRoom
            const pathfindingService = worldRoom.getPathfindingService();
 
            // Assuming actionPayload contains the destination
            const destination = this.payload;
            console.log(destination)

            pathfindingService.findPathForPlayer(this.mobile.position, destination, this.mobile)
                .then(path => {

                    console.log("path found")

                    // send path to the client
                    let positions = new ArraySchema<Position>();
                    for (let index = 0; index < path.length; index++) {
                        const element = path[index];
                        positions.push(element);
                    }

                    this.mobile.currentPath = positions;
                })
                .catch(error => {

                    console.log(error.message)
                    // Handle errors
                });
        }
    }
}
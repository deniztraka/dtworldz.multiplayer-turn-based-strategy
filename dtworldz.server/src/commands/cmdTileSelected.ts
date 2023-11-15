import { ServerError } from "colyseus";
import { WorldRoom } from "../rooms/WorldRoom";
import { Player } from "../schema/WorldState";
import { ICommand } from "./iCommand"
import { BaseCommandPayload, ServerEvents } from "dtworldz.shared-lib"

export class CmdTileSelected implements ICommand {
    tick: number;
    payload: { x: number, y: number }
    constructor(commandPayload: BaseCommandPayload) {
        this.tick = commandPayload.tick
        this.payload = commandPayload.payload
    }
    execute(worldRoom: WorldRoom, player: Player): void {

        worldRoom.pathfinder.findPath(player.mapPos.x, player.mapPos.y, this.payload.x, this.payload.y)
        .then(result => {
            worldRoom.broadcast(ServerEvents.PathCalculated, {sessionId: player.client.sessionId, path: result.path});
        })
        .catch(error => {
            worldRoom.broadcast(ServerEvents.PathCalculated, {sessionId: player.client.sessionId, path: []});
        });
        console.log("Tile selected job is executed for player " + player.client.sessionId);
    }

}
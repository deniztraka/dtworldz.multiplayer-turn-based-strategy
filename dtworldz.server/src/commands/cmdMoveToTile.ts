import { WorldRoom } from "../rooms/WorldRoom";
import { Player, MapPos } from "../schema/WorldState";
import { ICommand } from "./iCommand"
import { BaseCommandPayload } from "dtworldz.shared-lib"

export class CmdMoveToTile implements ICommand {
    tick: number;
    payload: { x: number, y: number }
    constructor(commandPayload: BaseCommandPayload) {
        this.tick = commandPayload.tick
        this.payload = commandPayload.payload
    }
    execute(worldRoom: WorldRoom, player: Player): void {
        player.mapPos = new MapPos(this.payload.x, this.payload.y);
        console.log("Move to tile command is executed for player " + player.client.sessionId);
    }

}
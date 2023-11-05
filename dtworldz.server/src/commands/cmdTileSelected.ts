import { WorldRoom } from "../rooms/WorldRoom";
import { Player } from "../rooms/WorldState";
import { ICommand } from "./iCommand"
import { BaseCommandPayload } from "dtworldz.shared-lib"

export class CmdTileSelected implements ICommand {
    tick: number;
    payload: { x: number, y: number }
    constructor(commandPayload: BaseCommandPayload) {
        this.tick = commandPayload.tick
        this.payload = commandPayload.payload
    }
    execute(worldRoom: WorldRoom, player: Player): void {
        console.log("Tle selected job is executed");
    }

}
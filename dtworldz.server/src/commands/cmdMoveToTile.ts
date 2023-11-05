import { WorldRoom } from "../rooms/WorldRoom";
import { Player } from "../rooms/WorldState";
import { ICommand } from "./iCommand"

export class CmdMoveToTile implements ICommand {
    tick: number;
    payload: { x: number, y: number }
    constructor(commandPayload: ICommandPayload) {
        this.tick = commandPayload.tick
        this.payload = commandPayload.payload
    }
    execute(worldRoom: WorldRoom, player: Player): void {
        console.log("Move to tile command is executed");
    }

}
import { Commands } from "dtworldz.shared-lib";
import { CmdTileSelected } from "../commands/cmdTileSelected";
import { ICommand } from "../commands/iCommand";

export class CommandFactory {
    constructor() {

    }

    get(commandPayload:any) : ICommand {
            switch (commandPayload.id) {
                case Commands.TileSelected:
                    return new CmdTileSelected(commandPayload)
            }
    }
}
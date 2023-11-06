import { BaseCommandPayload, Commands } from "dtworldz.shared-lib";
import { CmdTileSelected, CmdMoveToTile } from "../commands";
import { ICommand } from "../commands/iCommand";

export class CommandFactory {
    constructor() {

    }

    get(commandPayload: BaseCommandPayload): ICommand {
        switch (commandPayload.id) {
            case Commands.TileSelected:
                return new CmdTileSelected(commandPayload)
            case Commands.MoveToTile:
                return new CmdMoveToTile(commandPayload)
        }
    }
}
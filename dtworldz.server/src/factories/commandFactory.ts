import { Commands } from "dtworldz.shared-lib";
import { TileSelectedCommand } from "../commands/tileSelectedCommand";

export class CommandFactory {
    constructor() {

    }

    get(commandPayload:any) : ICommand {
            switch (commandPayload.id) {
                case Commands.TileSelected:
                    return new TileSelectedCommand(commandPayload)
            }
    }
}
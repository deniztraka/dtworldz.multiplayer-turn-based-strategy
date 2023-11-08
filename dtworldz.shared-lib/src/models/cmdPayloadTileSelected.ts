import { Commands } from "./commands";
import { BaseCommandPayload } from "./baseCommandPayload";

class CmdPayloadTileSelected extends BaseCommandPayload {
    constructor(tick: number, payload: { x: number, y: number }) {
        super(Commands.TileSelected, tick, payload);
    }
}

export { CmdPayloadTileSelected }
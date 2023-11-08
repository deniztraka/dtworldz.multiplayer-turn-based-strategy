import { Commands } from "./commands";
import { BaseCommandPayload } from "./baseCommandPayload";

class CmdPayloadMoveToTile extends BaseCommandPayload {
    constructor(tick: number, payload: { x: number, y: number }) {
        super(Commands.MoveToTile, tick, payload);
    }
}

export { CmdPayloadMoveToTile }
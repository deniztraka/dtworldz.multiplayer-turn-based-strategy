import { WorldRoom } from "../../rooms/dtWorldz";
import { Player } from "../../schema/mobiles/player";
import { AtomicAction } from "./atomicAction";

export class FindPathAction extends AtomicAction {
    constructor(player: Player, actionPayload: any) {
        super(player, actionPayload);
    }

    execute(worldRoom: WorldRoom): void {
        throw new Error("Method not implemented.");
    }
}
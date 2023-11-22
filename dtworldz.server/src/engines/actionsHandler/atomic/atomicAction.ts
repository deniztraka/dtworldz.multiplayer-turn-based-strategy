import { WorldRoom } from "../../../rooms/dtWorldz";
import { DTWorldzState } from "../../../schema/dtWorldzState";
import { Player } from "../../../schema/mobiles/player";
import { BaseGameAction } from "../baseGameAction";

export abstract class AtomicAction extends BaseGameAction {
    startTime: any;

    constructor(player:Player, actionPayload: any) {
        super(player, actionPayload);
        this.startTime = new Date().getTime();
    }

    abstract execute(worldRoom: WorldRoom):void
}
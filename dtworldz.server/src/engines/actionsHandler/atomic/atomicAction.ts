import { WorldRoom } from "../../../rooms/dtWorldz";
import { DTWorldzState } from "../../../schema/dtWorldzState";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { BaseGameAction } from "../baseGameAction";

export abstract class AtomicAction extends BaseGameAction {
    startTime: any;

    constructor(player:BaseMobile, payload: any) {
        super(player, payload);
        this.startTime = new Date().getTime();
    }

    abstract execute(worldRoom: WorldRoom):void
}
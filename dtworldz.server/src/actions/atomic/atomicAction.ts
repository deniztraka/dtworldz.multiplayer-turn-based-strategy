import { WorldRoom } from "../../rooms/dtWorldz";
import { DTWorldzState } from "../../schema/dtWorldzState";
import { Player } from "../../schema/mobiles/player";
import { BaseGameAction } from "../baseGameAction";

export abstract class AtomicAction extends BaseGameAction {
    duration: number;
    startTime: any;
    elapsedTime: number;

    constructor(player:Player, duration:number) {
        super(player);
        this.duration = duration;
        this.startTime = new Date().getTime();
        this.elapsedTime = 0;
    }

    abstract execute(worldRoom: WorldRoom):void
}
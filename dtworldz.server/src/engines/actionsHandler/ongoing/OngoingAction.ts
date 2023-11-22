import { WorldRoom } from "../../../rooms/dtWorldz";
import { Player } from "../../../schema/mobiles/player";
import { BaseGameAction } from "../baseGameAction";

export abstract class OngoingAction extends BaseGameAction {
    duration: number;
    startTime: any;
    elapsedTime: number;
    
    constructor(player:Player, actionPayload: any, duration:number) {
        super(player, actionPayload);
        this.duration = duration;
        this.startTime = new Date().getTime();
        this.elapsedTime = 0;
    }

    abstract update(roomState: WorldRoom, deltaTime: number):void;
}


// abstract execute(roomState: DTWorldzState):void
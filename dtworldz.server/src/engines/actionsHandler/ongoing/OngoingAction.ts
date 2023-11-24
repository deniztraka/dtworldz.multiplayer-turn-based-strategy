import { WorldRoom } from "../../../rooms/dtWorldz";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { BaseGameAction } from "../baseGameAction";

export abstract class OngoingAction extends BaseGameAction {
    duration: number;
    startTime: any;
    elapsedTime: number;
    
    constructor(mobile:BaseMobile, payload: any, duration:number) {
        super(mobile, payload);
        this.duration = duration;
        this.startTime = new Date().getTime();
        this.elapsedTime = 0;
    }

    abstract update(roomState: WorldRoom, deltaTime: number):void;

    abstract onCompleted(roomState: WorldRoom):void;
}


// abstract execute(roomState: DTWorldzState):void
import { WorldRoom } from "../../../rooms/dtWorldz";
import { BaseMobile } from "../../../schema/mobiles/baseMobile";
import { Player } from "../../../schema/mobiles/player";
import { TilePosCost } from "../../../schema/tilemap/tile/tilePosCost";
import { AtomicAction } from "./atomicAction";
import { ArraySchema } from "@colyseus/schema";

export class NextTurnRequestAction extends AtomicAction {
    constructor(mobile: BaseMobile, payload: any) {
        super(mobile, payload);
    }

    execute(worldRoom: WorldRoom): void {
        if (this.mobile instanceof Player) {
            const nextTurnResult = worldRoom.requestNextTurn(this.mobile);
            if(nextTurnResult){
                this.mobile.setMovingNow(false);
                this.mobile.currentPath = new ArraySchema<TilePosCost>();
                //Send the hunt result to the client
                // const player = (this.mobile as Player);
                // player.client.send('ca_next-turn-result',
                // {
                //     aid: 'next-turn-result',
                //     sessionId: player.client.sessionId,
                //     payload: {
                //         result: true,
                //         message: "Day " + worldRoom.getTurnManager().turnCount + " started."
                //     }
                // });
            }
        }
    }
}
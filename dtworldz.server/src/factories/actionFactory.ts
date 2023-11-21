import { FindPathAction } from "../actions/atomic/findPathAction"
import { BaseGameAction } from "../actions/baseGameAction"
import { Player } from "../schema/mobiles/player"

export class ActionFactory {
    constructor() {

    }

    get(player:Player, commandPayload: { uid: any }): BaseGameAction {
        switch (commandPayload.uid) {
            case 'ca-uid.FIND_PATH':
                return new FindPathAction(player, commandPayload)
            // case 'CA-uid.MOVE_TO_TILE':
            //     return new MoveToTileAction(commandPayload)
        }
    }
}
import { FindPathAction } from "./atomic/findPathAction"
import { BaseGameAction } from "./baseGameAction"
import { MoveAction } from "./ongoing/moveAction"
import { Player } from "../../schema/mobiles/player"

export class ActionFactory {
    constructor() {

    }

    get(player:Player, action: { aid: string, payload:any}): BaseGameAction {
        switch (action.aid) {
            case 'select-tile':
                return new FindPathAction(player, action.payload)
            case 'move':
                 return new MoveAction(player, action.payload)
        }
    }
}

import { FindPathAction } from "./atomic/findPathAction"
import { BaseGameAction } from "./baseGameAction"
import { MoveAction } from "./ongoing/moveAction"
import { Player } from "../../schema/mobiles/player"

export class ActionFactory {
    constructor() {

    }

    get(player:Player, commandPayload: { aid: any }): BaseGameAction {
        console.log(commandPayload);
        switch (commandPayload.aid) {
            case 'select-tile':
                return new FindPathAction(player, commandPayload)
            case 'move':
                 return new MoveAction(player, commandPayload)
        }
    }
}
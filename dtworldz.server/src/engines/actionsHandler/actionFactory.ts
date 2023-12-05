import { FindPathAction } from "./atomic/findPathAction"
import { NextTurnRequestAction } from "./atomic/nextTurnRequestAction"
import { BaseGameAction } from "./baseGameAction"
import { MoveAction } from "./ongoing/moveAction"
import { Player } from "../../schema/mobiles/player"
import { HuntAction } from "./atomic/huntAction"
import { AttackAction } from "./atomic/attackAction"

export class ActionFactory {
    constructor() {

    }

    get(player: Player, action: { aid: string, payload: any }): BaseGameAction {
        switch (action.aid) {
            case 'select-tile':
                return new FindPathAction(player, action.payload)
            case 'move':
                return new MoveAction(player, action.payload)
            case 'next-turn-request':
                return new NextTurnRequestAction(player, action.payload)
            case 'hunt':
                return new HuntAction(player, action.payload)
            case 'attack':
                return new AttackAction(player, action.payload)
        }
    }
}


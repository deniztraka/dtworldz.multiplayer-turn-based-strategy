import { Player } from "../../schema/mobiles/player";

export abstract class BaseGameAction {
    player: Player;
    actionPayload: any;
    constructor(player: Player, actionPayload: any) {
        this.player = player;
        this.actionPayload = actionPayload;
    }
}
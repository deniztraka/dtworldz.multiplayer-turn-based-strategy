import { Player } from "../schema/mobiles/player";

export abstract class BaseGameAction {
    player: Player;
    constructor(player: Player) {
        this.player = player;
    }
}
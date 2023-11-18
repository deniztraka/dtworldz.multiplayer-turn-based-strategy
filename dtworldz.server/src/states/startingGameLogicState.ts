import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";

// Concrete states
export class StartingGameLogicState extends BaseGameLogicState {
    exit(): void {
        console.log("StartingGameLogicState: Countdown is finished.");
    }

    enter() {
        console.log("StartingGameLogicState: Countdown is started.");
        // load map
        // load players
        // load monsters
        // load items
        // load npcs
        // load quests
        // load skills
        // load spells
        // load effects
        // load buffs
        // load debuffs
        // load zones
        // load dungeons
        // load instances
        // load raids
        // load parties
        // load guilds
        // load factions
        // load shops
        // load vendors
        // load merchants
    }

    update() {
        // Update countdown, transition to Started state when countdown finishes
        // if (gameRoom.isCountdownFinished()) {
        //     gameRoom.changeState(new StartedState());
        // }
    }
}
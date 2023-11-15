import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";

// Concrete states
export class StartingGameLogicState extends BaseGameLogicState {
    exit(): void {

    }
    enter() {
        // Start countdown
        //gameRoom.startCountdown();
    }

    update() {
        // Update countdown, transition to Started state when countdown finishes
        // if (gameRoom.isCountdownFinished()) {
        //     gameRoom.changeState(new StartedState());
        // }
    }
}
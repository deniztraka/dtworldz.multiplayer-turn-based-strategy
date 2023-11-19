import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";

// Concrete states
export class RunningGameLogicState extends BaseGameLogicState {
    exit(): void {

    }
    enter() {
        this.gameRoom.broadcast('gameIsRunning', {});
        console.log("GameLogicState: Game Is Started and Running");
    }

    update(deltaTime: number) {

    }
}
import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";

// Concrete states
export class GameIsEndedState extends BaseGameLogicState {


    constructor(gameRoom: WorldRoom) {
        super(gameRoom);

    }
    exit(): void {
        console.log("GameIsEndedState: Exiting from game.");
       
    }

    enter() {
        console.log("GameIsEndedState: Game is ended.");
        this.gameRoom.broadcast('sa_end-game');
        this.gameRoom.disconnect();
    }

    update(deltaTime: number): void {

    }
}




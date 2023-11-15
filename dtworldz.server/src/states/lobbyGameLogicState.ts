import { BaseGameLogicState } from "./baseGameLogicState";
import { StartingGameLogicState } from "./startingGameLogicState";

// Concrete states
export class LobbyGameLogicState extends BaseGameLogicState {

    exit(): void {
        console.log("GameLogicState: Exiting Lobby");
    }

    enter() {
        console.log("GameLogicState: Entering Lobby");
    }

    update(deltaTime: number) {
        // Check if enough players are ready, then transition to Starting state
        if (this.areAllPlayersReady()) {
            this.gameRoom.changeState(new StartingGameLogicState(this.gameRoom));
        }
    }

    /**
     * Checks if all players are ready
     *
     * @return {*}  {boolean}
     * @memberof LobbyGameLogicState
     */
    areAllPlayersReady(): boolean {
        let allPlayersReady = true;
        this.gameRoom.state.players.forEach(player => {
            if (!player.isReady) {
                allPlayersReady = false;
            }
        });
        return allPlayersReady;
    }
}
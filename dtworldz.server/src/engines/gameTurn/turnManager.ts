import { WorldRoom } from "../../rooms/dtWorldz";
import { Player } from "../../schema/mobiles/player";

export class TurnManager {
    private currentPlayerIndex: number;
    private turnDuration: number;
    private elapsedTime: number;
    private gameRoom: WorldRoom;
    private lastBroadcastTime: number;

    constructor(gameRoom: WorldRoom, turnDuration = 10000) {
        this.gameRoom = gameRoom;
        this.currentPlayerIndex = 0;
        this.turnDuration = turnDuration;
        this.elapsedTime = 0;
        this.lastBroadcastTime = 0;
    }

    startTurn() {
        this.elapsedTime = 0;
        this.lastBroadcastTime = 0;
        console.log(`Turn started for player: ${this.getCurrentPlayer().name}`);
        this.gameRoom.broadcast('sa_turn-start', { currentPlayerSessionId: this.getCurrentPlayer().client.sessionId });
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.turnDuration) {
            this.nextTurn();
        } else if (this.elapsedTime - this.lastBroadcastTime >= 1000) {
            let timeLeft = Math.floor((this.turnDuration - this.elapsedTime));
            this.gameRoom.broadcast('sa_turnTimeLeft', { timeLeft: timeLeft / 1000, totalTime: this.turnDuration /1000 });
            const currentPlayer = this.getCurrentPlayer();
            if(currentPlayer){
                //console.log(`Time left for ${this.getCurrentPlayer().name}: ${timeLeft} seconds`);
            }else {
                //console.log(`Time left for not existing user: ${timeLeft} seconds`);
                this.nextTurn(true);
            }
            this.lastBroadcastTime = this.elapsedTime;
        }
    }

    nextTurn(force: boolean = false) {
        const players = Array.from(this.gameRoom.getPlayers().values());

        if(players.length === 1 && !force){
            return;
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % players.length;
        this.startTurn();
    }

    getCurrentPlayer() : Player {
        const players = Array.from(this.gameRoom.getPlayers().values());
        return players[this.currentPlayerIndex] as Player;
    }
}

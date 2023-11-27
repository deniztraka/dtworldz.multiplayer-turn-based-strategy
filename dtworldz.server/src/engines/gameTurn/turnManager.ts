import { WorldRoom } from "../../rooms/dtWorldz";
import { Player } from "../../schema/mobiles/player";


export class TurnManager {
    private players: Player[];
    private currentPlayerIndex: number;
    private turnDuration: number; // in milliseconds
    private elapsedTime: number; // Tracks elapsed time for the current turn
    private gameRoom: WorldRoom;

    constructor(gameRoom: WorldRoom, players: Player[], turnDuration = 10000) {
        this.gameRoom = gameRoom;
        this.players = players;
        this.currentPlayerIndex = 0;
        this.turnDuration = turnDuration;
        this.elapsedTime = 0;

        console.log("TurnManager initialized with turn duration:", this.turnDuration);
    }

    startTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        console.log(`Starting turn for player: ${currentPlayer.client.sessionId}`);

        this.gameRoom.broadcast('sa_turn-start', { currentPlayerSessionId: currentPlayer.client.sessionId });
        this.elapsedTime = 0; // Reset elapsed time
    }

    update(deltaTime: number) {
        this.elapsedTime += deltaTime;

        // Optionally, broadcast the remaining time every second
        if (this.elapsedTime % 1000 < deltaTime) {
            this.gameRoom.broadcast('turn_time_update', { remainingTime: this.turnDuration - this.elapsedTime });
        }

        if (this.elapsedTime >= this.turnDuration) {
            this.nextTurn(); // Proceed to the next turn when the duration is reached
        }
    }

    nextTurn() {
        console.log("Transitioning to next turn.");
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.startTurn();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    // Additional methods like handling player disconnection, modifying turn order, etc.
}

import { WorldRoom } from "../../rooms/dtWorldz";
import { Player } from "../../schema/mobiles/player";
export class TurnManager {
    private players: Player[];
    private currentPlayerIndex: number;
    private turnDuration: number;
    private elapsedTime: number;
    private countdownDuration: number;
    private gameRoom: WorldRoom;
    private isCountdownActive: boolean;
    private lastBroadcastTime: number; // New field to track last broadcast time

    constructor(gameRoom: WorldRoom, players: Player[], turnDuration = 10000, countdownDuration = 3000) {
        this.gameRoom = gameRoom;
        this.players = players;
        this.currentPlayerIndex = 0;
        this.turnDuration = turnDuration;
        this.elapsedTime = 0;
        this.countdownDuration = countdownDuration;
        this.isCountdownActive = false;
        this.lastBroadcastTime = 0;

        console.log("TurnManager initialized with turn duration:", this.turnDuration);
    }

    startTurn() {
        this.isCountdownActive = true;
        this.elapsedTime = 0;
        this.lastBroadcastTime = 0; // Reset last broadcast time
        console.log(`Countdown started for player: ${this.getCurrentPlayer().name}`);
    }

    update(deltaTime: number) {
        if (this.isCountdownActive) {
            this.elapsedTime += deltaTime;
            if (this.elapsedTime >= this.countdownDuration) {
                this.isCountdownActive = false;
                this.elapsedTime = 0;
                this.startTurnInternal();
            } else {
                // Check if one second has passed since the last broadcast
                if (this.elapsedTime - this.lastBroadcastTime >= 1000) {
                    this.gameRoom.broadcast('sa_turnCountdown', { timeLeft: Math.floor((this.countdownDuration - this.elapsedTime) / 1000) });
                    this.lastBroadcastTime = this.elapsedTime;
                }
            }
        } else {
            this.elapsedTime += deltaTime;
            if (this.elapsedTime >= this.turnDuration) {
                this.nextTurn();
            }
        }
    }

    private startTurnInternal() {
        const currentPlayer = this.getCurrentPlayer();
        console.log(`Starting turn for player: ${currentPlayer.name}`);
        this.gameRoom.broadcast('sa_turn-start', { currentPlayerSessionId: currentPlayer.client.sessionId });
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

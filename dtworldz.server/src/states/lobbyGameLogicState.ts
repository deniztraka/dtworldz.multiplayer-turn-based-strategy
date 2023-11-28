import { BaseGameLogicState } from "./baseGameLogicState";
import { LoadingGameLogicState } from "./loadingGameLogicState";

// Concrete states
export class LobbyGameLogicState extends BaseGameLogicState {
    isReadyToStart: boolean = false;

    exit(): void {
        console.log("GameLogicState: Exiting Lobby");
    }

    enter() {
        console.log("GameLogicState: Entering Lobby");

        this.attachLobbyEvents();
    }

    attachLobbyEvents() {
        this.gameRoom.onMessage('isReady', (client, message) => {
            const player = this.gameRoom.state.players.get(client.sessionId)
            player.isReady = message.isReady;
            console.log(`${player.name} set itself as ${player.isReady}. `)
            this.sendReadyStatus();
        });

        this.gameRoom.onMessage('charIndex', (client, message) => {
            const player = this.gameRoom.state.players.get(client.sessionId)
            player.charIndex = message.charIndex;
            console.log(`${player.name} set itself as character ${player.charIndex}. `)
        });

        this.gameRoom.onMessage('chat', (client, message) => {
            const player = this.gameRoom.state.players.get(client.sessionId)
            //console.log(`${player.name}: ${message}`);  // print the message to console
            // Broadcast message to all clients
            this.gameRoom.broadcast('chat', { sender: player.name, text: message });
        })

        this.gameRoom.onMessage('startGame', (client, message) => {
            this.gameRoom.lock();
            console.log(`Game is loading...`);
            //this.gameRoom.changeState(new LoadingGameLogicState(this.gameRoom));
            this.isReadyToStart = true;
        })
    }

    update(deltaTime: number) {
        // check if ready to start, then transition to Starting state
        if (this.isReadyToStart && this.areAllPlayersReady()) {
            this.gameRoom.changeState(new LoadingGameLogicState(this.gameRoom));
        }
    }

    sendReadyStatus() {
        // Check if enough players are ready, then transition to Starting state
        if (this.areAllPlayersReady()) {
            this.gameRoom.getOwnerClient().send('canBeStarted', { canBeStarted: true });

            console.log("All players are ready. Game can be started.");
        } else {
            this.gameRoom.getOwnerClient().send('canBeStarted', { canBeStarted: false });
            console.log("Not all players are ready. Game can't be started.");
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
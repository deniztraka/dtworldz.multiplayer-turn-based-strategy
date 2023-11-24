import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";
import { TurnManager } from "../engines/gameTurn/turnManager";

// Concrete states
export class RunningGameLogicState extends BaseGameLogicState {
    private turnManager: TurnManager;

    constructor(gameRoom: WorldRoom) {
        super(gameRoom);

        const players = Array.from(this.gameRoom.getPlayers().values());
        this.turnManager = new TurnManager(this.gameRoom, players);
    }
    exit(): void {

    }
    enter() {
        this.gameRoom.broadcast('gameIsRunning', {});
        this.attachGameEvents();
        console.log("GameLogicState: Game Is Started and Running");
        this.turnManager.startTurn();
    }

    update(deltaTime: number) {
        this.turnManager.update(deltaTime);
    }

    attachGameEvents() {
        this.gameRoom.onMessage('ca_action', (client, actionPayload) => {
            // console.log(`received action request from ${client.sessionId}`)

            // get client's player
            let player = this.gameRoom.getPlayer(client.sessionId);

            if (player === this.turnManager.getCurrentPlayer()) {
                // create action from payload and handle it (will be put in queue)
                let action = this.gameRoom.getActionFactory().get(player, actionPayload);
                this.gameRoom.getActionManager().handleNewAction(action);
            } else {
                console.log(`Player ${client.sessionId} tried to act on somebody's turn`);
            }
        });
    }
}
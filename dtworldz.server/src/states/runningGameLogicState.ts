import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";
import { TurnManager } from "../engines/gameTurn/turnManager";

// Concrete states
export class RunningGameLogicState extends BaseGameLogicState {
    private turnManager: TurnManager;
    private preCooldownDuration: number;
    private isCooldownActive: boolean;

    constructor(gameRoom: WorldRoom, preCooldownDuration = 5000) {
        super(gameRoom);
        this.turnManager = new TurnManager(this.gameRoom);
        this.preCooldownDuration = preCooldownDuration;
        this.elapsedTime = 0;
        this.isCooldownActive = true; // Start with cooldown active
    }
    exit(): void {

    }
    enter() {
        this.gameRoom.broadcast('gameIsRunning', {});
        console.log("GameLogicState: Pre-game cooldown started. Get ready!");
        this.attachGameEvents();
        // this.turnManager.startTurn();
    }

    update(deltaTime: number) {
        if (this.isCooldownActive) {
            this.elapsedTime += deltaTime;
            if (this.elapsedTime >= this.preCooldownDuration) {
                this.isCooldownActive = false;
                this.attachGameEvents();
                console.log("GameLogicState: Game Is Started and Running");
                this.turnManager.startTurn();
            }
        } else {
            this.turnManager.update(deltaTime);
        }
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
                console.log(`Player ${player.name} tried to act on somebody's turn`);
            }
        });
    }
}
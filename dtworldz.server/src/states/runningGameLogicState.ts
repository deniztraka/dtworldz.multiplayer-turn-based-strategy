import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";
import { TurnManager } from "../engines/gameTurn/turnManager";
import { Player } from "../schema/mobiles/player";
import { TilePosCost } from "../schema/tilemap/tile/tilePosCost";
import { ArraySchema } from "@colyseus/schema";

export class RunningGameLogicState extends BaseGameLogicState {
    
    
    private turnManager: TurnManager;
    private preCooldownDuration: number;
    private isCooldownActive: boolean;
    private timeSinceLastBroadcast: number; // Time since the last countdown broadcast

    constructor(gameRoom: WorldRoom, preCooldownDuration = 5000) {
        super(gameRoom);
        this.turnManager = new TurnManager(this.gameRoom);
        this.preCooldownDuration = preCooldownDuration;
        this.elapsedTime = 0;
        this.isCooldownActive = true;
        this.timeSinceLastBroadcast = 0;
    }
    exit(): void {
        this.gameRoom.broadcast('gameIsOver', {});
        console.log("GameLogicState: Running state exiting. ");
    }

    enter() {
        this.gameRoom.broadcast('gameIsRunning', {});
        console.log("GameLogicState: Pre-game cooldown started. Get ready!");
        this.attachGameEvents();
    }

    update(deltaTime: number) {
        if (this.isCooldownActive) {
            this.elapsedTime += deltaTime;
            this.timeSinceLastBroadcast += deltaTime;

            // Broadcast the countdown every 1000 ms (1 second)
            if (this.timeSinceLastBroadcast >= 1000) {
                let timeLeft = Math.max(this.preCooldownDuration - this.elapsedTime, 0);
                this.gameRoom.broadcast('sa_countdown', { timeLeft: Math.floor(timeLeft / 1000) });
                this.timeSinceLastBroadcast = 0; // Reset the time since last broadcast
            }

            if (this.elapsedTime >= this.preCooldownDuration) {
                this.isCooldownActive = false;
                //this.gameRoom.broadcast('sa_countdown', { timeLeft: 0 }); // Final broadcast
                console.log("GameLogicState: Game Is Started and Running");
                this.turnManager.startTurn();
            }
        } else {
            this.turnManager.update(deltaTime);
        }
    }

    handleTurnProcess() {
        console.log("GameLogicState: Handling turn effects");

        // update current player's hunger, energy and health
        const currentPlayer = this.turnManager.getCurrentPlayer();
        if(currentPlayer){
            currentPlayer.hunger -= currentPlayer.hungerDecay;
            currentPlayer.energy = currentPlayer.maxEnergy
            currentPlayer.health += currentPlayer.healthRegen;
        }

        // iterate all players and clear their currentPath and setMovement to false
        this.gameRoom.getPlayers().forEach((player: Player) => {
            player.currentPath = new ArraySchema<TilePosCost>();
            player.setMovingNow(false);
        });
        
    }

    attachGameEvents() {
        this.gameRoom.onMessage('ca_action', (client, actionPayload) => {
            // console.log(`received action request from ${client.sessionId}`)
            // get client's player
            let player = this.gameRoom.getPlayer(client.sessionId);
            if (player === this.turnManager.getCurrentPlayer() && !this.isCooldownActive) {
                // create action from payload and handle it (will be put in queue)
                let action = this.gameRoom.getActionFactory().get(player, actionPayload);
                this.gameRoom.getActionManager().handleNewAction(action);
            } else {
                console.log(`Player ${player.name} tried to act on somebody's turn`);
                client.send('ca_action_result', { aid: actionPayload.aid, sessionId: client.sessionId, payload: { result: false } });
            }
        });
    }

    requestNextTurn(mobile: Player): boolean {
        if(this.turnManager.getCurrentPlayer().sessionId === mobile.client.sessionId){
            //console.log(`Next turn request is succesfully made ${mobile.name} requested next turn`);
            this.turnManager.nextTurn(true);
            return true;
        } else {
            console.log(`Player ${mobile.name} tried to request next turn on somebody's turn`);
            return false;
        }
    }
}

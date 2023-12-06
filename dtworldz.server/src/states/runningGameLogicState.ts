import { BaseGameLogicState } from "./baseGameLogicState";
import { WorldRoom } from "../rooms/dtWorldz";
import { TurnManager } from "../engines/gameTurn/turnManager";
import { Player } from "../schema/mobiles/player";
import { TilePosCost } from "../schema/tilemap/tile/tilePosCost";
import { ArraySchema } from "@colyseus/schema";
import { GameIsEndedState } from "./gameIsEndedState";

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
            this.gameRoom.getPlayers().forEach((player: Player) => {
                if (player.isDead && !player.isDeadBroadCasted) {
                    player.isDeadBroadCasted = true;
                    this.gameRoom.broadcast('sa_playerDead', { sessionId: player.sessionId });
                    this.turnManager.setSkipTurnFor(player.sessionId);
                }

                if (player.isDead && this.gameRoom.clients.length === 1) {
                    this.gameRoom.changeState(new GameIsEndedState(this.gameRoom));
                } 
            });

            const isAllDead = this.isAllDead();
            if (isAllDead) {
                console.log("all dead")
                this.gameRoom.changeState(new GameIsEndedState(this.gameRoom));
                return;
            }

            //console.log("just before daed chck." + isAllDead)

            

            this.turnManager.update(deltaTime);
        }
    }

    isAllDead(): boolean {
        let allDead = true;
        this.gameRoom.clients.forEach((client) => {
            if (!this.turnManager.skipTurnList.includes(client.sessionId)) {
                allDead = false;
            }
        });
        return allDead;
    }

    handleTurnProcess() {
        console.log("GameLogicState: Handling turn effects");

        // update current player's hunger, energy and health
        const currentPlayer = this.turnManager.getCurrentPlayer();
        if (currentPlayer && !currentPlayer.isDead) {
            currentPlayer.hunger -= currentPlayer.hungerDecay;
            currentPlayer.energy = currentPlayer.maxEnergy
            currentPlayer.health += currentPlayer.healthRegen;

            if (currentPlayer.hunger <= 0) {
                currentPlayer.health -= currentPlayer.hungerDamage;
            }
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
            if (!player) {
                return;
            }

            if (player !== this.turnManager.getCurrentPlayer()) {
                client.send('ca_action_result', { aid: actionPayload.aid, sessionId: client.sessionId, payload: { result: false, message: `It's not your time.` } });
                return;
            }

            if (this.isCooldownActive) {
                client.send('ca_action_result', { aid: actionPayload.aid, sessionId: client.sessionId, payload: { result: false, message: `Game is not started yet.` } });
                return;
            }

            if (player.isDead) {
                // client.send('ca_action_result', { aid: actionPayload.aid, sessionId: client.sessionId, payload: { result: true, message: `You are dead.` } });
                return;
            }

            let action = this.gameRoom.getActionFactory().get(player, actionPayload);
            this.gameRoom.getActionManager().handleNewAction(action);
        });
    }

    requestNextTurn(mobile: Player): boolean {


        if (this.turnManager.getCurrentPlayer().sessionId === mobile.client.sessionId) {
            //console.log(`Next turn request is succesfully made ${mobile.name} requested next turn`);
            this.turnManager.nextTurn(true);
            return true;
        } else {
            console.log(`Player ${mobile.name} tried to request next turn on somebody's turn`);
            return false;
        }
    }
}

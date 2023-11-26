import { Room, Client } from "colyseus";
import { DTWorldzState } from "../schema/dtWorldzState";
import { Player } from "../schema/mobiles/player";
import { BaseGameLogicState } from "../states/baseGameLogicState";
import { ActionManager } from "../engines/actionsHandler/actionManager";
import { LobbyGameLogicState } from "../states/lobbyGameLogicState";
import * as http from 'http';
import { ActionFactory } from "../engines/actionsHandler/actionFactory";
import { DynamicPathfindingService } from "../engines/pathfinding/pathFindingService";
import { BaseMobile } from "../schema/mobiles/baseMobile";

export class WorldRoom extends Room<DTWorldzState> {
    
    private fixedTimeStep = 1000 / 60;
    private currentGameLogicState: BaseGameLogicState;
    private actionManager: ActionManager;
    private creatorClient: Client | undefined;
    private actionFactory: ActionFactory;

    onCreate(options: { clientName: string, maxPlayers: number }) {
        this.setState(new DTWorldzState(25, 25));
        this.maxClients = options.maxPlayers;
        this.actionManager = new ActionManager(this);
        this.actionFactory = new ActionFactory();
        this.changeState(new LobbyGameLogicState(this));

        this.creatorClient = null;

        console.log(options);

        // set some options to show in the rooms list
        // this.setMetadata({ friendlyFire: true });

        // defining fixed update loop in here
        let elapsedTime = 0;
        this.setSimulationInterval((deltaTime) => {
            elapsedTime += deltaTime;

            while (elapsedTime >= this.fixedTimeStep) {
                elapsedTime -= this.fixedTimeStep;
                this.fixedUpdate(this.fixedTimeStep);
            }
        });
    }

    /**
     * This method is called on every fixed time step.
     *
     * @param {number} timeStep
     * @memberof WorldRoom
     */
    fixedUpdate(timeStep: number) {

        this.currentGameLogicState.update(timeStep);
        this.actionManager.updateActions(timeStep);
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth(_client: Client, _options: any, _request: http.IncomingMessage) { return true; }

    /**
     * This is the callback function when a client joins the room.
     *
     * @param {Client} client
     * @param {*} options
     * @memberof WorldRoom
     */
    onJoin(client: Client, options: { clientName: string }, _auth: any) {
        console.log(`${client.sessionId} | ${options.clientName} is joined!`);
        const player = new Player(client, options.clientName, undefined);
        // add player to the state
        this.state.players.set(client.sessionId, player);
        if (this.creatorClient === null) {
            this.creatorClient = client;
            player.setOwner(true);
        }
    }

    /**
     * This is the callback function when a client leaves the room.
     *
     * @param {Client} client
     * @param {boolean} _consented
     * @memberof WorldRoom
     */
    onLeave(client: Client, _consented: boolean) {
        console.log(client.sessionId, "left!");
        if (this.state.players.has(client.sessionId)) {
            this.state.players.delete(client.sessionId);
        }
    }

    /**
     * This is the callback function when the room is disposed.
     * Disposal happens when there are no more clients in the room.
     *
     * @memberof WorldRoom
     */
    onDispose() {
        console.log("room", this.roomId, "disposing...");
        this.currentGameLogicState.elapsedTime = 0;
        this.currentGameLogicState.exit();
    }

    getOwnerClient() {
        return this.creatorClient
    }

    /**
     * Changes the state of the room.
     *
     * @param {BaseGameLogicState} newState
     * @memberof WorldRoom
     */
    changeState(newState: BaseGameLogicState) {
        if (this.currentGameLogicState) {
            this.currentGameLogicState.exit();
        }
        this.currentGameLogicState = newState;
        this.currentGameLogicState.enter();
    }

    getPathfindingService(mobile: BaseMobile) {
        // create new one each time so we can have fresh grid
        return new DynamicPathfindingService(this, mobile);
    }

    getClient(sessionId: string) {
        return this.clients.find(c => c.sessionId === sessionId);
    }

    getPlayer(sessionId: string) {
        return this.state.players.get(sessionId);
    }

    getPlayers() {
        return this.state.players;
    }

    getActionFactory() {
        return this.actionFactory
    }

    getActionManager() {
        return this.actionManager;
    }
}





/*

    -- broadcast a message to all clients
    this.onMessage("action", (client, message) => {
        this.broadcast("action-taken", "an action has been taken!");
    });

    -- sends "fire" event to every client, except the one who triggered it.
    this.onMessage("fire", (client, message) => {
        this.broadcast("fire", message, { except: client });
    });

    -- Broadcasting a message to all clients, only after a change in the state has been applied:
    this.onMessage("destroy", (client, message) => {
        -- perform changes in your state!
        this.state.destroySomething();

        -- this message will arrive only after new state has been applied
        this.broadcast("destroy", "something has been destroyed", { afterNextPatch: true });
    });


    -- Broadcasting a schema-encoded message
    class MyMessage extends Schema {
    @type("string") message: string;

    }

    onCreate() {
        this.onMessage("action", (client, message) => {
            const data = new MyMessage();
            data.message = "an action has been taken!";
            this.broadcast(data);
        });
    }


 */

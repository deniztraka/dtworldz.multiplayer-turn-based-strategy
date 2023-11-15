import { Room, Client } from "colyseus";
import { DTWorldzState } from "../schema/dtWorldzState";
import { Player } from "../schema/mobiles/player";
import * as http from 'http';

export class WorldRoom extends Room<DTWorldzState> {
    fixedTimeStep = 1000 / 60;

    onCreate(_options: {clientName: string}) {
        this.setState(new DTWorldzState());
        
        // set some options to show in the rooms list
        // this.setMetadata({ friendlyFire: true });

        // set map dimensions
        this.state.width = 10;
        this.state.height = 10;

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
     * @param {number} _timeStep
     * @memberof WorldRoom
     */
    fixedUpdate(_timeStep: number) {

    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (_client: Client, _options: any, _request: http.IncomingMessage) { return true; }

    /**
     * This is the callback function when a client joins the room.
     *
     * @param {Client} client
     * @param {*} options
     * @memberof WorldRoom
     */
    onJoin(client: Client, options: {clientName: string}, _auth: any) {
        console.log(`${client.sessionId} | ${options.clientName} is joined!`);

        // add player to the state
        this.state.players.set(client.sessionId, new Player(undefined));
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

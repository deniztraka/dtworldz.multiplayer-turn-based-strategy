"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldRoom = void 0;
const colyseus_1 = require("colyseus");
const WorldState_1 = require("./WorldState");
const mathUtils_1 = require("../utils/mathUtils");
const dtworldz_shared_lib_1 = require("dtworldz.shared-lib");
const commandFactory_1 = require("../factories/commandFactory");
class WorldRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.fixedTimeStep = 1000 / 60;
    }
    onCreate(options) {
        this.setState(new WorldState_1.WorldState());
        // set map dimensions
        this.state.mapWidth = 10;
        this.state.mapHeight = 10;
        this.buildWorld();
        this.onMessage(dtworldz_shared_lib_1.ClientEvents.Input, (client, command) => {
            // handle player input
            const player = this.state.players.get(client.sessionId);
            console.log(command);
            // enqueue command to player command buffer.
            player.commandPayloadQueue.push(command);
        });
        // this.onMessage(ClientEvents.TileSelected, (client, tile: { x: number; y: number; }) => {
        //   // handle player input
        //   const player = this.state.players.get(client.sessionId);
        //   console.log(tile);
        // });
        let elapsedTime = 0;
        this.setSimulationInterval((deltaTime) => {
            elapsedTime += deltaTime;
            while (elapsedTime >= this.fixedTimeStep) {
                elapsedTime -= this.fixedTimeStep;
                this.fixedTick(this.fixedTimeStep);
            }
        });
    }
    fixedTick(timeStep) {
        // const velocity = 2;
        this.state.players.forEach(player => {
            let commandPayload;
            // dequeue player commandPayloads and create commands to execute
            while (commandPayload = player.commandPayloadQueue.shift()) {
                var commandFactory = new commandFactory_1.CommandFactory();
                var playerCommand = commandFactory.get(commandPayload);
                //player.tick = commandPayload.tick;
                playerCommand.execute();
            }
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        const player = new WorldState_1.Player();
        player.tileX = mathUtils_1.MathUtils.getRandomInt(this.state.mapWidth);
        player.tileY = mathUtils_1.MathUtils.getRandomInt(this.state.mapHeight);
        this.state.players.set(client.sessionId, player);
    }
    onLeave(client, consented) {
        console.log(client.sessionId, "left!");
        this.state.players.delete(client.sessionId);
    }
    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
    // TODO: extract to another place
    buildWorld() {
        var data = [
            [10, 11, 12, 13, 14, 15, 16, 10, 11, 12],
            [13, 11, 10, 12, 12, 104, 16, 10, 16, 10],
            [12, 10, 16, 13, 14, 104, 16, 16, 13, 12],
            [10, 11, 12, 104, 104, 104, 16, 10, 11, 12],
            [13, 11, 10, 104, 12, 15, 16, 10, 16, 10],
            [12, 10, 16, 104, 14, 15, 16, 16, 13, 12],
            [10, 11, 12, 13, 104, 15, 16, 10, 11, 12],
            [13, 11, 10, 12, 12, 104, 16, 10, 16, 10],
            [12, 10, 16, 13, 14, 104, 16, 16, 13, 12],
            [10, 11, 12, 13, 14, 15, 16, 10, 11, 12]
        ];
        for (let x = 0; x < this.state.mapWidth; x++) {
            for (let y = 0; y < this.state.mapHeight; y++) {
                var tile = new WorldState_1.Tile();
                tile.x = x;
                tile.y = y;
                tile.index = data[x][y];
                this.state.mapData.push(tile);
            }
        }
    }
}
exports.WorldRoom = WorldRoom;

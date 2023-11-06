import Phaser from "phaser";
import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../../backend";
import tileAtlasUrl from "./../../public/assets/images/tilemaps/tileatlas-64x64.png";
import { MouseHandler } from "../handlers/ui/mouseHandlers";
import { WorldMap } from "../models/worldMap"
import { Player } from "../models/player"

export class GameScene extends Phaser.Scene {
    room: Room | undefined;

    currentPlayer: Player | undefined;
    players: { [sessionId: string]: Player } = {};

    debugFPS: Phaser.GameObjects.Text | undefined;

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    elapsedTime = 0;
    fixedTimeStep = 1000 / 60;

    currentTick: number = 0;
    mouseHandler: MouseHandler
    worldMap: WorldMap

    constructor() {
        super({ key: "GameScene" });
        this.mouseHandler = new MouseHandler(this);
    }

    preload() {
        this.load.image('tiles', tileAtlasUrl);
    }

    instantiatePlayer(clientPlayer: any) {
        var playerMapPosition = this.worldMap.floorLayer.getTileAt(clientPlayer.tileX, clientPlayer.tileY);
        let player = new Player(this, playerMapPosition.getCenterX(), playerMapPosition.getCenterY());
        return player
    }

    async create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000", });

        // connect with the room
        await this.connect();

        this.room.state.players.onAdd((client: any, sessionId: any) => {
            if(!this.worldMap){
                this.worldMap = new WorldMap(this);
            }

            const player = this.instantiatePlayer(client);
            this.players[sessionId] = player;

            // is current player
            if (sessionId === this.room.sessionId) {
                this.currentPlayer = player;
            } else {
                // listening for server updates
                // client.onChange(() => {
                //     //
                //     // we're going to LERP the positions during the render loop.
                //     //
                //     player.setData('serverWorldX', client.worldX);
                //     player.setData('serverWorldY', client.worldY);
                // });

            }

        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_player: any, sessionId: any) => {
            const entity = this.players[sessionId];
            if (entity) {
                entity.destroy();
                delete this.players[sessionId]
            }
        });

        // this.cameras.main.startFollow(this.ship, true, 0.2, 0.2);
        // this.cameras.main.setZoom(1);
        this.cameras.main.setBounds(0, 0, 800, 600);


        this.mouseHandler.attachEvents()
    }

    async connect() {
        // add connection status text
        const connectionStatusText = this.add
            .text(0, 0, "Trying to connect with the server...")
            .setStyle({ color: "#ff0000" })
            .setPadding(4)

        const client = new Client(BACKEND_URL);

        try {
            this.room = await client.joinOrCreate("world_room", {});

            // connection successful!
            connectionStatusText.destroy();

        } catch (e) {
            // couldn't connect
            connectionStatusText.text = "Could not connect with the server.";
        }

    }

    update(time: number, delta: number): void {
        // skip loop if not connected yet.
        if (!this.currentPlayer) { return; }

        this.elapsedTime += delta;
        while (this.elapsedTime >= this.fixedTimeStep) {
            this.elapsedTime -= this.fixedTimeStep;
            this.fixedTick(time, this.fixedTimeStep);
        }

        this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;
    }

    fixedTick(_time: any, _delta: any) {
        this.currentTick++;

        //this.room.send(ClientEvents.Input, this.inputPayload);



        for (let sessionId in this.players) {
            // interpolate all player entities
            // (except the current player)
            if (sessionId === this.room.sessionId) {
                continue;
            }

            const remotePlayers = this.players[sessionId];
            // const { serverWorldX, serverWorldY } = entity.data.values;

            // entity.x = Phaser.Math.Linear(entity.x, serverWorldX, 0.2);
            // entity.y = Phaser.Math.Linear(entity.y, serverWorldY, 0.2);
        }

    }
}
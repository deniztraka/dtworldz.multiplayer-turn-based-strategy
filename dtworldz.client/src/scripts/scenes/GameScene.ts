/**
 * ---------------------------
 * Phaser + Colyseus - Part 4.
 * ---------------------------
 * - Connecting with the room
 * - Sending inputs at the user's framerate
 * - Update other player's positions WITH interpolation (for other players)
 * - Client-predicted input for local (current) player
 * - Fixed tickrate on both client and server
 */

import Phaser from "phaser";
import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../../backend";
import tileAtlasUrl from "./../../public/assets/images/tilemaps/tileatlas-64x64.png";
// import { Vector } from "matter";
import { MouseHandler } from "../handlers/ui/mouseHandlers";
import { WorldMap } from "../models/worldMap"
import { ClientEvents } from "dtworldz.shared-lib";

export class GameScene extends Phaser.Scene {
    room: Room | undefined;

    currentPlayer: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
    playerEntities: { [sessionId: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody } = {};

    debugFPS: Phaser.GameObjects.Text | undefined;

    localRef: Phaser.GameObjects.Rectangle | undefined;
    remoteRef: Phaser.GameObjects.Rectangle | undefined;

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

    async create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000", });

        // connect with the room
        await this.connect();

        this.room.state.players.onAdd((player:any, sessionId:any) => {
            this.worldMap = new WorldMap(this);

            var playerMapPosition = this.worldMap.floorLayer.getTileAt(player.tileX,player.tileY);
            const entity = this.physics.add.sprite(playerMapPosition.getCenterX(), playerMapPosition.getCenterY(), 'heroImage');
            entity.setOrigin(0.5, 1);
            this.playerEntities[sessionId] = entity;

            // is current player
            if (sessionId === this.room.sessionId) {
                this.currentPlayer = entity;
            } else {
                // listening for server updates
                player.onChange(() => {
                    //
                    // we're going to LERP the positions during the render loop.
                    //
                    entity.setData('serverWorldX', player.worldX);
                    entity.setData('serverWorldY', player.worldY);
                });

            }

        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_player:any, sessionId:any) => {
            const entity = this.playerEntities[sessionId];
            if (entity) {
                entity.destroy();
                delete this.playerEntities[sessionId]
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

    fixedTick(_time:any, _delta:any) {
        this.currentTick++;

        //this.room.send(ClientEvents.Input, this.inputPayload);

 

        for (let sessionId in this.playerEntities) {
            // interpolate all player entities
            // (except the current player)
            if (sessionId === this.room.sessionId) {
                continue;
            }

            const entity = this.playerEntities[sessionId];
            const { serverWorldX, serverWorldY } = entity.data.values;

            entity.x = Phaser.Math.Linear(entity.x, serverWorldX, 0.2);
            entity.y = Phaser.Math.Linear(entity.y, serverWorldY, 0.2);
        }

    }
}
import Phaser from "phaser";
import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../../backend";
import tileAtlasUrl from "./../../public/assets/images/tilemaps/tileatlas-64x64.png";
import { MouseHandler } from "../handlers/ui/mouseHandlers";
import { WorldMap } from "../models/worldMap"
import { Player } from "../models/player"
import { ServerEvents } from "dtworldz.shared-lib";
import { IPoint } from "../interfaces/ipoint";

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
    markers: any;

    constructor() {
        super({ key: "GameScene" });
        this.mouseHandler = new MouseHandler(this);
    }

    preload() {
        this.load.image('tiles', tileAtlasUrl);
    }

    instantiatePlayer(client: any, sessionId: any) {
        var playerMapPosition = this.worldMap.floorLayer.getTileAt(client.mapPos.x, client.mapPos.y);
        let player = new Player(this, client, sessionId, playerMapPosition.getCenterX(), playerMapPosition.getCenterY());
        return player
    }

    async create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000", });

        // connect with the room
        await this.connect();

        this.room.state.players.onAdd((client: any, sessionId: any) => {
            if (!this.worldMap) {
                this.worldMap = new WorldMap(this);
            }

            const player = this.instantiatePlayer(client, sessionId);
            this.players[sessionId] = player;

            // is current player
            if (sessionId === this.room.sessionId) {
                this.currentPlayer = player;
                this.attachServerEvents();
            } else {
                // listening for server updates
                // client.onChange(() => {
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
    attachServerEvents() {
        this.room.onMessage(ServerEvents.PathCalculated, (path: IPoint[]) => {
            this.currentPlayer.setPath(path);
            this.drawPath();
        });

        //register currentPlayer's position change event
        this.currentPlayer.client.listen("mapPos", (currentValue:any, previousValue:any) => {
            if(previousValue)
                console.log(`previous position was: ${previousValue.x},${previousValue.y}`);

            // check if there is a path to follow and last point in the path equals to the current position
            if(this.currentPlayer.currentPath.length > 0 && this.currentPlayer.currentPath[this.currentPlayer.currentPath.length-1].x === currentValue.x && this.currentPlayer.currentPath[this.currentPlayer.currentPath.length-1].y === currentValue.y){
                // this.currentPlayer.currentPath = [];
                this.currentPlayer.followPath();
            }

            if(currentValue)
                console.log(`current position is now ${currentValue.x},${currentValue.y}`);
        });
    }

    drawPath() {
        // clear markers
        if (this.markers) {
            this.markers.forEach((marker: any) => {
                marker.destroy();
            });
        }
        this.markers = [];

        // draw markers
        this.currentPlayer.currentPath.forEach((pathItem: IPoint, index: number) => {
            // skip first and last
            if (index === 0) {
                return;
            } else if (index === this.currentPlayer.currentPath.length - 1) {
                return;
            }

            // draw marker
            var tile = this.worldMap.floorLayer.getTileAt(pathItem.x, pathItem.y);
            if (tile) {
                var marker = this.add.image(tile.getCenterX(), tile.getCenterY(), 'markerImage');
                marker.setDepth(100);
                // set marker rotation to match the tile
                if (index < this.currentPlayer.currentPath.length - 1) {
                    var nextTile = this.worldMap.floorLayer.getTileAt(this.currentPlayer.currentPath[index + 1].x, this.currentPlayer.currentPath[index + 1].y);
                    if (nextTile) {
                        var radRotation = Phaser.Math.Angle.Between(tile.getCenterX(), tile.getCenterY(), nextTile.getCenterX(), nextTile.getCenterY());
                        let angle = Phaser.Math.RadToDeg(radRotation);
                        angle += 90;
                        marker.setAngle(angle);
                    }
                }
                this.markers.push(marker);
            }
        });
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
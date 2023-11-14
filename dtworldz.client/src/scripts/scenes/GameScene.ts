import Phaser from "phaser";
import { Room, Client } from "colyseus.js";
import { BACKEND_URL } from "../../backend";
import tileAtlasUrl from "./../../public/assets/images/tilemaps/tileatlas-64x64.png";
import dirtTile from "./../../public/assets/images/tilemaps/tile.png";
import { MouseHandler } from "../handlers/ui/mouseHandlers";
import { WorldMap } from "../models/worldMap"
import { Player } from "../models/player"
import { ClientEvents, ServerEvents } from "dtworldz.shared-lib";
import { IPoint } from "../interfaces/ipoint";

export class GameScene extends Phaser.Scene {
    room: Room | undefined;

    public currentPlayer: Player | undefined;
    currentTurnSessionId: string | undefined;
    players: { [sessionId: string]: Player } = {};

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    elapsedTime = 0;
    fixedTimeStep = 1000 / 60;

    currentTick: number = 0;
    mouseHandler: MouseHandler
    worldMap: WorldMap
    markers: any;
    playerName: string;

    constructor() {
        super({ key: "GameScene" });
        this.mouseHandler = new MouseHandler(this);
    }

    init(data: { playerName: string; }) {
        this.playerName = data.playerName;
    }

    preload() {
        this.load.image('tiles', tileAtlasUrl);
        this.load.image('dirtTile', dirtTile);
    }

    instantiatePlayer(client: any, sessionId: any) {
        var playerMapPosition = this.worldMap.floorLayer.getTileAt(client.mapPos.x, client.mapPos.y);
        let player = new Player(this, client, sessionId, playerMapPosition.getCenterX(), playerMapPosition.getCenterY());

        this.players[sessionId] = player;

        // is current player
        if (sessionId === this.room.sessionId) {
            player.setPlayerName(this.playerName);
            this.currentPlayer = player;
            this.room.send(ClientEvents.InitPlayerData, { sessionId: sessionId, name: this.playerName });
            this.events.emit('characterInitialized');
        }

        this.cameras.main.startFollow(player, true, 0.05, 0.05);
        this.cameras.main.setZoom(1);


        return player
    }

    async create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.scene.launch('UIScene', { playerName: this.playerName })

        // connect with the room
        await this.connect();

        this.attachRoomEvents();

        this.mouseHandler.attachEvents()
    }
    attachRoomEvents() {
        this.room.state.players.onAdd((client: any, sessionId: any) => {
            if (!this.worldMap) {
                this.worldMap = new WorldMap(this);
            }

            const player = this.instantiatePlayer(client, sessionId);

            console.log(`${player.playerName} is joined`);
            this.attachServerEvents(player);
        });

        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_player: any, sessionId: any) => {
            const entity = this.players[sessionId];
            if (entity) {
                entity.destroy();
                delete this.players[sessionId]
            }
        });

        this.room.state.listen("currentPlayerSessionId", (currentPlayerSessionId: string) => {
            console.log(`now player ${currentPlayerSessionId}'s turn`);
            this.currentTurnSessionId = currentPlayerSessionId;

        });

        this.room.onMessage(ServerEvents.PathCalculated, (payload: { sessionId: number, path: IPoint[] }) => {
            this.players[payload.sessionId].setPath(payload.path);
            this.drawPath();
        });

        this.room.onMessage(ServerEvents.PlayerDataInitialized, (payload: { sessionId: number, name: string }) => {
            const player = this.players[payload.sessionId]
            if(player){
                player.setPlayerName(payload.name);
            }
        });

        this.room.onMessage(ServerEvents.TurnTimeSecondsLeft, (currentPlayerSessionId: any) => {
            //console.log(currentPlayerSessionId);
        });
    }
    attachServerEvents(player: Player) {

        //register currentPlayer's position change event
        player.client.listen("mapPos", (currentValue: any, previousValue: any) => {
            // check if there is a path to follow and last point in the path equals to the current position
            if (player.currentPath.length > 0 && player.currentPath[player.currentPath.length - 1].x === currentValue.x && player.currentPath[player.currentPath.length - 1].y === currentValue.y) {
                // console.log(`moving player ${player.sessionId} to next point`);
                player.followPath();
            }
        });
    }

    drawPath() {
        // clear markers
        if (this.currentPlayer.markers) {
            this.currentPlayer.markers.forEach((marker: any) => {
                marker.destroy();
            });
        }
        this.currentPlayer.markers = [];

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
                this.currentPlayer.markers.push(marker);
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

    }

    fixedTick(_time: any, _delta: any) {
        this.currentTick++;
    }
}
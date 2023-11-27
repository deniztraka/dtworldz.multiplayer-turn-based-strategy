import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import { WorldMapHelper } from "../helpers/worldMapHelper";
import { MouseHandler } from "../handlers/ui/mouseHandlers";
import { ClientPlayer } from "../models/clientPlayer";
import { GameRunningUIScene } from "./GameRunningUIScene";
// import { GameScene } from "./GameSceneOld";

export class GameIsRunningScene extends Phaser.Scene {
    
    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};
    titleText: DTLabel;
    brandText: DTLabel;
    subTitleText: DTLabel;
    floorMap: Phaser.Tilemaps.TilemapLayer;
    backgroundImg: Phaser.GameObjects.Image;
    welcomeMessage: DTLabel;
    natureLayer: Phaser.Tilemaps.TilemapLayer;
    tileMap: Phaser.Tilemaps.Tilemap;
    floorTileSet: Phaser.Tilemaps.Tileset;
    mouseHandler: MouseHandler;
    localClient: any;
    players: { [sessionId: string]: any } = {};
    localPlayer: ClientPlayer;

    constructor() {
        super({ key: "GameIsRunningScene" })

    }

    init(data: { room: Room, clients: { [sessionId: string]: any }, localClient: any }) {
        this.room = data.room;
        this.clients = data.clients;
        this.mouseHandler = new MouseHandler(this);
        this.setLocalClient(this.clients);
    }



    preload() {

    }

    create() {
        this.loadingUI();
        this.buildMap();
        this.attachRoomEvents();
        this.instantiatePlayers();

        //this.createTileLabels();
        this.mouseHandler.init()

        this.events.once('gameIsLoaded', () => {
            this.onGameIsLoaded();
            
        });




        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.localPlayer, true, 0.05, 0.05);
        (window as any).fx = this.cameras.main.postFX.addTiltShift(0.25, 0.2, 0, 0.5, 1, 1);

        this.events.emit('gameIsLoaded');
    }

    getRemotePlayers() : ClientPlayer[]{
        return Object.values(this.players).filter((player: ClientPlayer) => {
            return player.sessionId !== this.room.sessionId;
        });
    }

    buildMap() {
        const biomeData = WorldMapHelper.getBiomeLayerData(this.room.state.tilemap, this.room.state.width, this.room.state.height);
        this.createFloorLayer(biomeData);
        
        const natureData = WorldMapHelper.getNatureLayerData(this.room.state.tilemap, this.room.state.width, this.room.state.height);
        this.createNatureLayer(natureData);
    }
    instantiatePlayers() {
        for (const sessionId in this.clients) {
            if (Object.prototype.hasOwnProperty.call(this.clients, sessionId)) {
                const client = this.clients[sessionId];
                this.instantiatePlayer(client, sessionId);
            }
        }
    }
    instantiatePlayer(client: any, sessionId: string) {
        var playerMapPosition = this.floorMap.getTileAt(client.position.x, client.position.y);

        let player = new ClientPlayer(this, client, sessionId, playerMapPosition.getCenterX(), playerMapPosition.getCenterY());

        this.players[sessionId] = player;

        // is current player
        if (sessionId === this.room.sessionId) {
            this.localPlayer = player;
        }

        return player
    }

    onGameIsLoaded() {
        this.scene.add('GameRunningUIScene', GameRunningUIScene, true);
    }

    createFloorLayer(tileData: number[][]) {
        const mapDefinition = new Phaser.Tilemaps.MapData({
            width: this.room.state.width,
            height: this.room.state.height,
            tileWidth: 128,
            tileHeight: 64,
            orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
            format: Phaser.Tilemaps.Formats.ARRAY_2D
        });

        this.tileMap = new Phaser.Tilemaps.Tilemap(this, mapDefinition);

        this.floorTileSet = this.tileMap.addTilesetImage('floorTileSet', 'plainTiles', 128, 128, 0, 0);

        this.floorMap = this.tileMap.createBlankLayer('floorLayer', this.floorTileSet, this.scale.width / 2, this.scale.height / 2 - 200 + 32);


        let y = 0;

        tileData.forEach(row => {

            row.forEach((index, x) => {
                if (index === 1) {
                    // todo: somewhere here, we should include biome data into account
                    // currently it only works with Plains biome type because we only have that tileset
                    let floorTileIndexes = WorldMapHelper.getFloorTileIndexes();
                    const chosenIndex = floorTileIndexes[Math.floor(Math.random() * floorTileIndexes.length)];
                    let tile = this.floorMap.putTileAt(chosenIndex, x, y);
                    tile.properties.isSelected = false;
                }
            });

            y++;
        });
    }

    createNatureLayer(natureData: number[][]) {
        this.natureLayer = this.tileMap.createBlankLayer('natureLayer', this.floorTileSet, this.scale.width / 2, this.scale.height / 2 - 200);

        let y = 0;
        natureData.forEach(row => {

            // None = 0,
            // Forest = 1,
            // Mountain = 2,

            row.forEach((index, x) => {
                if (index === 1) {
                    // todo: somewhere here, we should include biome data into account
                    // currently it only works with Plains biome type because we only have that tileset
                    let forestTileIndexes = WorldMapHelper.getForestTileIndexes();
                    const chosenIndex = forestTileIndexes[Math.floor(Math.random() * forestTileIndexes.length)];
                    let tile = this.natureLayer.putTileAt(chosenIndex, x, y);
                } else if (index === 2) {
                    // todo: somewhere here, we should include biome data into account
                    // currently it only works with Plains biome type because we only have that tileset
                    let mountainTileIndexes = WorldMapHelper.getMountainTileIndexes();
                    const chosenIndex = mountainTileIndexes[Math.floor(Math.random() * mountainTileIndexes.length)];
                    let tile = this.natureLayer.putTileAt(chosenIndex, x, y);
                }
            });

            y++;
        });

    }

    attachRoomEvents() {
        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_client: any, sessionId: any) => {
            console.log(`${sessionId} is removed`);
            const client = this.clients[sessionId]

            if (client) {
                delete this.clients[sessionId]
                delete this.players[sessionId]
            }
        });

        this.room.onMessage("sa_turn-start", (message: { currentPlayerSessionId: string }) => {
            const player = this.players[message.currentPlayerSessionId];
            this.events.emit('turn-start', player);
        });
    }

    loadingUI() {

        

    }

    setLocalClient(clients: { [sessionId: string]: any; }): any {
        for (const sessionId in clients) {
            if (Object.prototype.hasOwnProperty.call(clients, sessionId)) {
                const client = clients[sessionId];
                if (this.room.sessionId === sessionId) {
                    this.localClient = client;
                }
            }
        }
    }

 createTileLabels() {
    
        this.floorMap.forEachTile(tile => {
            
            // Get the center x, y of the tile
            const centerX = tile.getCenterX();
            const centerY = tile.getCenterY();

            // Create a label for the tile
            const label = this.add.text(centerX, centerY, `${ tile.x }-${ tile.y }`, {
                font: '16px Arial', color: '#86bbf0'
            }).setOrigin(0.5, 0.5); // Center the text on the tile
        });
    
    }

}
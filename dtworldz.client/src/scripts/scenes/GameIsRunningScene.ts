import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import { WorldMapHelper } from "../helpers/worldMapHelper";
import { MouseHandler } from "../handlers/ui/mouseHandlers";
import { ClientPlayer } from "../models/clientPlayer";
import { GameRunningUIScene } from "./GameRunningUIScene";
import { ActionResultFactory } from "../factories/actionResultFactory";
import { SoundManager } from "../helpers/soundManager";
// import { GameScene } from "./GameSceneOld";

export class GameIsRunningScene extends Phaser.Scene {


    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};
    titleText: DTLabel;
    brandText: DTLabel;
    subTitleText: DTLabel;
    backgroundImg: Phaser.GameObjects.Image;
    welcomeMessage: DTLabel;
    natureLayer: Phaser.Tilemaps.TilemapLayer;
    tileMap: Phaser.Tilemaps.Tilemap;
    floorTileSet: Phaser.Tilemaps.Tileset;
    mouseHandler: MouseHandler;
    localClient: any;
    players: { [sessionId: string]: any } = {};
    localPlayer: ClientPlayer;
    floorLayer: Phaser.Tilemaps.TilemapLayer;
    componentsLayer: any;
    tileComponentRegistry: any;
    isDead: boolean = false;
    isGameStarted: boolean;
    turnCount: number;
    soundManager: any;

    constructor() {
        super({ key: "GameIsRunningScene" })
        this.tileComponentRegistry = new Array([]);
        this.isDead = false;
    }

    init(data: { room: Room, clients: { [sessionId: string]: any }, localClient: any }) {
        this.room = data.room;
        this.clients = data.clients;
        this.mouseHandler = new MouseHandler(this);
        this.setLocalClient(this.clients);
        this.soundManager = new SoundManager(this);
        
    }

    update(time: number, delta: number): void {
        if(this.isDead) {
            
        }
       
        this.soundManager.setListenerPosition(this.localPlayer.container.x, this.localPlayer.container.y);
    }

    preload() {

        this.load.audio('step', '/assets/audio/walk.mp3');
        this.load.audio('hitAnimal', '/assets/audio/hitAnimal.wav');
        this.load.audio('attack', '/assets/audio/attack.mp3');
        this.load.audio('dead', '/assets/audio/dead.wav');

    }

    create() {
        const scene: GameIsRunningScene = this;
        this.sound.stopByKey('darkwoods');



        this.loadingUI();

        this.buildMap();

        this.attachRoomEvents();

        this.listenChanges();

        this.instantiatePlayers();

        this.localPlayer.playerNameText.setAlpha(0);


        //this.createTileLabels();
        this.mouseHandler.init()

        this.events.once('gameIsLoaded', () => {
            this.onGameIsLoaded();

        });

        //(window as any).fx = this.cameras.main.postFX.addTiltShift(0.25, 0.2, 0, 0.5, 1, 1);


        this.cameras.main.startFollow(this.localPlayer.container, false, 0.75, 0.75, 0, 0);
        

        this.events.emit('gameIsLoaded');

        this.cameras.main.setZoom(1.25);

        this.localClient.listen('isDead', (isDead: boolean) => {
            if(isDead) {
                this.cameras.main.stopFollow();
            }
        });

        const cam = this.cameras.main;
        this.input.on("pointermove", function (p:any) {
            if (!p.isDown) return;

            cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
            cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
            });


    }
    listenChanges() {
        this.events.on('tile-component-changed', (data: { tile: any, key: string, change: any }) => {
            // destroy everything first
            const components = this.tileComponentRegistry[data.tile.position.y][data.tile.position.x];
            components.forEach((component: any) => {
                if (component.key === data.key) {
                    component.image.destroy();
                }
            });

            // then recreate
            const serverComponents = Array.from(data.tile.components.$items.values());
            serverComponents.forEach((component: any) => {
                if (component.name === "Deers") {
                    let deerTileIndexes = WorldMapHelper.getDeersTileIndexes();
                    const chosenIndex = deerTileIndexes[Math.floor(Math.random() * deerTileIndexes.length)];
                    let clientTile = this.floorLayer.getTileAt(data.tile.position.x, data.tile.position.y);
                    const deersComponentImage = this.add.sprite(clientTile.getCenterX(), clientTile.getCenterY(), 'tileComponents', chosenIndex).setOrigin(0.5, 0.5).setScale(1.5);
                    this.add.existing(deersComponentImage);

                    this.tileComponentRegistry[data.tile.position.y][data.tile.position.x].push({ image: deersComponentImage, key: component.name });
                }
            });
        });
    }

    getRemotePlayers(): ClientPlayer[] {
        return Object.values(this.players).filter((player: ClientPlayer) => {
            return player.sessionId !== this.room.sessionId;
        });
    }

    getRemoteAlivePlayers(): ClientPlayer[] {
        return Object.values(this.players).filter((player: ClientPlayer) => {
            return player.sessionId !== this.room.sessionId && !player.client.isDead;
        });
    }

    requestNextTurn() {
        this.room.send('ca_action', { aid: 'next-turn-request', payload: null });
    }

    buildMap() {
        const biomeData = WorldMapHelper.getBiomeLayerData(this.room.state.tilemap, this.room.state.width, this.room.state.height);
        this.createFloorLayer(biomeData);

        const natureData = WorldMapHelper.getNatureLayerData(this.room.state.tilemap, this.room.state.width, this.room.state.height);
        this.createNatureLayer(natureData);

        this.createTileComponents();
    }

    createTileComponents() {
        let serverMap: { id: number, biome: number, nature: number, components: any[] }[] = Array.from(this.room.state.tilemap.$items.values());

        for (let y = 0; y < this.room.state.height; y++) { // Iterate over rows with 'y'
            let row = [];
            this.tileComponentRegistry[y] = [];
            for (let x = 0; x < this.room.state.width; x++) { // Iterate over columns with 'x'
                let tile = serverMap[y * this.room.state.width + x];
                let tileComponents = Array.from((tile.components as any).$items.values());
                tileComponents.forEach((component: any) => {
                    if (component.name === "Deers") {
                        let deerTileIndexes = WorldMapHelper.getDeersTileIndexes();
                        const chosenIndex = deerTileIndexes[Math.floor(Math.random() * deerTileIndexes.length)];
                        let clientTile = this.floorLayer.getTileAt(x, y);
                        const deersComponentImage = this.add.sprite(clientTile.getCenterX(), clientTile.getCenterY(), 'tileComponents', chosenIndex).setOrigin(0.5, 0.5).setScale(1.5);
                        this.add.existing(deersComponentImage);

                        this.tileComponentRegistry[y][x] = [{ image: deersComponentImage, key: component.name}];
                        // console.log(`Deer:${chosenIndex} is added to ${x}, ${y} - ${clientTile.getCenterX()}, ${clientTile.getCenterY()}`);
                    }
                });
            }
        }
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
        var playerMapPosition = this.floorLayer.getTileAt(client.position.x, client.position.y);

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

        this.floorLayer = this.tileMap.createBlankLayer('floorLayer', this.floorTileSet, this.scale.width / 2, this.scale.height / 2 - 200);


        let y = 0;

        tileData.forEach(row => {

            row.forEach((index, x) => {
                if (index === 1) {
                    // todo: somewhere here, we should include biome data into account
                    // currently it only works with Plains biome type because we only have that tileset
                    let floorTileIndexes = WorldMapHelper.getFloorTileIndexes();
                    const chosenIndex = floorTileIndexes[Math.floor(Math.random() * floorTileIndexes.length)];
                    let tile = this.floorLayer.putTileAt(chosenIndex, x, y);
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

            // todo: somewhere here, we should include biome data into account

            row.forEach((index, x) => {
                if (index === 1) {
                    // currently it only works with Plains biome type because we only have that tileset
                    let forestTileIndexes = WorldMapHelper.getForestTileIndexes();
                    const chosenIndex = forestTileIndexes[Math.floor(Math.random() * forestTileIndexes.length)];
                    let tile = this.natureLayer.putTileAt(chosenIndex, x, y);
                } else if (index === 2) {
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
        this.room.state.players.onRemove((client: any, sessionId: any) => {
            console.log(`${client.name} is removed`);
            const player = this.players[sessionId];
            if (player) {
                player.destroy();
            }
            delete this.clients[sessionId]
            delete this.players[sessionId]
            this.events.emit('removed', sessionId);
        });

        this.room.onMessage("sa_turn-start", (message: { currentPlayerSessionId: string, turnCount: number }) => {
            this.turnCount = message.turnCount;
            const player = this.players[message.currentPlayerSessionId];
            this.events.emit('turn-start', player);
            this.localPlayer.setSelectedTile(null);
            this.events.emit('tile-props', null);
            
        });

        this.room.onMessage("sa_turnTimeLeft", (message: { timeLeft: number, totalTime: number }) => {
            this.events.emit('turn-countdown', message);
        });

        this.room.onMessage("sa_countdown", (message: { timeLeft: number, totalTime: number }) => {
            if(message.timeLeft == 0) {
                this.isGameStarted = true;
            }
            this.events.emit('countdown', message);
        });

        this.room.onMessage("sa_tile-props", (message: any) => {
            this.localPlayer.setSelectedTile(null);
            this.events.emit('tile-props', message);
            
        });

        this.room.onMessage("sa_playerDead", (message: {sessionId:string}) => {
            const player = this.players[message.sessionId] as ClientPlayer;
            console.log(`${player.playerName} is dead`);
            player.characterSprite.setTexture('graveStone');
            this.soundManager.play('dead', player.container.x, player.container.y, 10000);
        });

        

        this.room.onMessage('ca_action_result', (message: {aid:string, sessionId: string, payload:any}) => {
            const player = this.players[message.sessionId];
            const actionResult = ActionResultFactory.get(this, player, message);
            if(actionResult){
                actionResult.execute();
            } else {
                console.log(`action result is null for ${message.aid}`);
            }
        });

        this.room.onMessage("sa_end-game", () => {
            this.events.emit('end-game');
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

        this.floorLayer.forEachTile(tile => {

            // Get the center x, y of the tile
            const centerX = tile.getCenterX();
            const centerY = tile.getCenterY();

            // Create a label for the tile
            const label = this.add.text(centerX, centerY, `${tile.x}-${tile.y}`, {
                font: '16px Arial', color: '#86bbf0'
            }).setOrigin(0.5, 0.5); // Center the text on the tile
        });

    }


}
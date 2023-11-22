import Phaser from "phaser";
import { Room } from "colyseus.js";
import { DTLabel } from "../utils/ui/dtLabel";
import TextStyles from '../utils/ui/textStyles';
import { WorldMapHelper } from "../helpers/worldMapHelper";

export class GameIsRunningScene extends Phaser.Scene {
    room: Room | undefined;
    clients: { [sessionId: string]: any } = {};
    titleText: DTLabel;
    brandText: DTLabel;
    subTitleText: DTLabel;
    floorMap: Phaser.Tilemaps.TilemapLayer;
    backgroundImg: Phaser.GameObjects.Image;
    welcomeMessage: DTLabel;

    constructor() {
        super({ key: "GameIsRunningScene" })

    }

    init(data: { room: Room, clients: { [sessionId: string]: any } }) {

        this.room = data.room;
        this.clients = data.clients;

    }

    preload() {

    }

    create() {
        this.loadingUI();
        this.attachRoomEvents();

        this.events.once('gameIsLoaded', () => {
            this.onGameIsLoaded();
        });

        const mapData = WorldMapHelper.convertToMapData(this.room.state.tilemap, this.room.state.width, this.room.state.height);
        this.createTileMap(mapData);

        let heroImg = this.add.image(this.scale.width / 2+96, this.scale.height / 2-16, 'hero0').setDisplaySize(64, 64);
        
        this.cameras.main.setZoom(2);
    }

    onGameIsLoaded() {
        // tween background image alpha to 0 and remove it
        this.tweens.add({
            targets: this.backgroundImg,
            alpha: 0,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => {
                this.backgroundImg.destroy();
                this.brandText.destroy();
                this.subTitleText.destroy();
                this.titleText.destroy();
            }
        });
        this.tweens.add({
            targets: this.floorMap,
            alpha: 1,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => {

                this.tweens.add({
                    targets: this.welcomeMessage,
                    alpha: 0,
                    duration: 3000,
                    ease: 'Power2',
                    onComplete: () => {
                        this.welcomeMessage.destroy();
                    }
                });
            }
        });
    }

    createTileMap(tileData: number[][]) {
        const mapDefinition = new Phaser.Tilemaps.MapData({
            width: this.room.state.width,
            height: this.room.state.height,
            tileWidth: 64,
            tileHeight: 32,
            orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
            format: Phaser.Tilemaps.Formats.ARRAY_2D
        });

        const tileMap = new Phaser.Tilemaps.Tilemap(this, mapDefinition);

        const floorTileSet = tileMap.addTilesetImage('floorTileSet', 'tileAtlas', 64, 128,0,0);

        this.floorMap = tileMap.createBlankLayer('floorLayer', floorTileSet, this.scale.width/2, this.scale.height/2 -200)
            .setAlpha(0);

        let y = 0;

        tileData.forEach(row => {

            row.forEach((index, x) => {
                let tile = this.floorMap.putTileAt(index, x, y);
                tile.properties.isSelected = false;
            });

            y++;
        });

        this.events.emit('gameIsLoaded');
    }

    attachRoomEvents() {



        // remove local reference when entity is removed from the server
        this.room.state.players.onRemove((_client: any, sessionId: any) => {
            console.log(`${sessionId} is removed`);
            const client = this.clients[sessionId]

            if (client) {
                delete this.clients[sessionId]
            }
        });
    }

    loadingUI() {

        let scene: any = this;

        /** General UI Branding Starts **/
        this.backgroundImg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'loginBackground')
            .setOrigin(0.5, 0.5)
            .setTint(0x333333)
            .setDisplaySize(this.scale.width, this.scale.height);

        this.titleText = new DTLabel(this, this.scale.width / 2, 50, "Exiles of Lowlands").setStyle(TextStyles.H1).setColor("#E8D9A1");
        this.subTitleText = new DTLabel(this, this.scale.width / 2, 110, "The Darkening Mists").setStyle(TextStyles.H4).setColor("#B4AA83");
        this.brandText = new DTLabel(this, this.scale.width / 2, this.scale.height - 25, "DTWorldz").setStyle(TextStyles.H4).setColor("#E8D9A1").setAlpha(0.25);
        this.add.existing(this.titleText);
        this.add.existing(this.subTitleText);
        this.add.existing(this.brandText);
        /** General UI Branding Ends **/

        this.welcomeMessage = new DTLabel(this, this.scale.width / 2, this.scale.height / 2, "Welcome to the Lowlands..").setStyle(TextStyles.BodyText).setColor("#E8D9A1").setAlpha(0.5);
        this.add.existing(this.welcomeMessage);
    }

}